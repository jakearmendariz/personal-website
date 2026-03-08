import React, { useState, useEffect, useRef } from "react";
/*
Colors is a fun simulation I am playing with to simplify the colors
in a video stream to only the basics.
Hoping to expand on this and make it look cool, if not, posting for fun.
*/
function useUserMedia(requestedMedia) {
    const [mediaStream, setMediaStream] = useState(null);

    useEffect(() => {
        async function enableStream() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(requestedMedia);
                setMediaStream(stream);
            } catch (err) {
                console.log("Couldn't get user media :(")
            }
        }

        if (!mediaStream) {
            enableStream();
        } else {
            return function cleanup() {
                mediaStream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        }
    }, [mediaStream, requestedMedia]);

    return mediaStream;
}

const CAPTURE_OPTIONS = {
    audio: false,
    video: { facingMode: "environment" },
};


function Colors() {
    const processor = {};

    processor.doLoad = function doLoad() {
        const video = document.getElementById('videoElement');
        this.video = video;

        this.c1 = document.getElementById('c1');
        this.ctx1 = this.c1.getContext('2d');

        this.c2 = document.getElementById('c2');
        this.ctx2 = this.c2.getContext('2d');

        video.addEventListener('play', () => {
            this.width = Math.floor(video.videoWidth / 2.13);
            this.height = video.videoHeight / 3;
            this.timerCallback();
        }, false);
    };

    processor.timerCallback = function timerCallback() {
        if (this.video.paused || this.video.ended) {
            return;
        }
        this.computeFrame();
        setTimeout(() => {
            this.timerCallback();
        }, 0);
    };

    function distance(r1, g1, b1, r2, g2, b2) {
        return Math.sqrt(
            (r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2
        )
    }

    const COLORS = {
        B1: [255, 255, 255],
        B2: [173,216,230],
        B3: [135,206,250],
        B4: [0,0,139],
        B5: [25,25,112],
        B6: [0, 0, 0],

        YELLOW : [255,255,0],
        BLUE : [0,0,255],
        RED : [255,0,0],
        GREEN : [0, 255, 0],
        MIDNIGHTBLUE : [25,25,112],
        MAROON : [128,0,0],
        ORANGE : [255,165,0],
        LSALMON : [255,160,122],
        SALMON : [250,128,114],
        DARKGREEN : [0,100,0],
        SEAGREEN : [60,179,113],
        CADETBLUE : [95,158,160],
        VIOLET : [138,43,226],
        PURPLE : [128,0,128],
        PLUM : [221,160,221],
        BISQUE : [255,228,196],
        PEACH : [255,218,185],
        WHITE : [255, 255, 255],
        BROWN : [139,69,19],
        BURLY : [222,184,13],
        CHOCOLATE : [210,105,30],
        SANDBROWN : [244,164,96],
        HONEYDEW : [240,255,240],
        TOMATOE : [255,99,71],
        BLACK : [0,0,0],
    }
    const COLORSRGB = Object.values(COLORS);

    function closestColor(r, g, b) {
        let closestDistance = 100000000;
        let closestIndex = -1;
        for(let i = 0; i < COLORSRGB.length; i++) {
            const color = COLORSRGB[i];
            const currDistance = distance(
                color[0], color[1], color[2],
                r, g, b
            );
            if (currDistance < closestDistance) {
                closestDistance = currDistance;
                closestIndex = i;
            }
        }
        if (closestIndex === -1) {
            return [0, 0, 0];
        }
        return COLORSRGB[closestIndex];
    }

    processor.computeFrame = function computeFrame() {
        if (!this.ctx1) {
            return;
        }
        this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
        const frame = this.ctx1.getImageData(0, 0, this.width, this.height);
        const length = frame.data.length;
        const data = frame.data;

        for (let i = 0; i < length; i += 4) {
            const red = data[i + 0];
            const green = data[i + 1];
            const blue = data[i + 2];
            const [r, g, b] = closestColor(red, green, blue);
            [data[i], data[i + 1], data[i + 2]] = [r, g, b];
        }
        mirror(data, this.width, this.height);
        this.ctx2.putImageData(frame, 0, 0);
    };

    function mirror(data, width, height) {
        for (let i = 0; i < height; i++) {
            let rowStart = i * width * 4;
            let rowEnd = rowStart + width * 4;
            for (let j = 0; j < (width / 2) * 4; j += 4) {
                let frontIndex = rowStart + j;
                let backIndex = rowEnd - j - 4;
                for (let swap = 0; swap < 3; swap++) {
                    let temp = data[frontIndex + swap];
                    data[frontIndex + swap] = data[backIndex + swap];
                    data[backIndex + swap] = temp;
                }
            }
        }
    }

    const videoRef = useRef();
    const mediaStream = useUserMedia(CAPTURE_OPTIONS);

    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStream;
    }

    function handleCanPlay() {
        videoRef.current.play();
    }

    useEffect(() => {
        processor.doLoad();
    })
    processor.computeFrame();

    return (
        <div style={
            {
                margin: 0,
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
            <video ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline muted id="videoElement" style={{ display: "none",  width: "133vh", height: "100vh" }} />
            <canvas id="c1" style={{ display: "none" }}></canvas>
            <canvas id="c2" style={{ width: "133vh", height: "100vh" }}></canvas>
        </div>
    );
}

export default Colors;

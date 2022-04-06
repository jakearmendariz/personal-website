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
            // this ratios really confuse me. But its the only way it works as of now
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

    function isYellow(r, g, b) {
        // return r > 160 && g > 160 && b < 180;
        return Math.abs(r - g) < 80 && b < (r - 20) && b < (g - 20);
    }

    function isOrange(r, g, b) {
        // 255,165,0
        return Math.abs(r - b) > 170 && Math.abs(g - b) > 100 && Math.abs(r - g) > 60 && r > g && g > b;
    }

    function isBlack(r, g, b) {
        return r < 30 && b < 30 && g < 30;
    }

    function isWhite(r, g, b) {
        return r > 235 && b > 235 && g > 235;
    }

    function isGray(r, g, b) {
        return Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && Math.abs(r - b) < 10;
    }

    function mirror(data, width, height) {
        for (let i = 0; i < height; i++) {
            let rowStart = i * width * 4;
            let rowEnd = rowStart + width * 4;
            for (let j = 0; j < (width / 2) * 4; j += 4) {
                let frontIndex = rowStart + j;
                let backIndex = rowEnd - j - 4;
                // swap the 4 digits
                for (let swap = 0; swap < 3; swap++) {
                    let temp = data[frontIndex + swap];
                    data[frontIndex + swap] = data[backIndex + swap];
                    data[backIndex + swap] = temp;
                }
            }
        }
    }

    processor.computeFrame = function computeFrame() {
        if (!this.ctx1) {
            return;
        }
        // console.log("computeFrame");
        this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
        const frame = this.ctx1.getImageData(0, 0, this.width, this.height);
        const length = frame.data.length;
        const data = frame.data;

        for (let i = 0; i < length; i += 4) {
            const red = data[i + 0];
            const green = data[i + 1];
            const blue = data[i + 2];
            if (isYellow(red, green, blue)) {
                [data[i], data[i + 1], data[i + 2]] = [255, 255, 0];
            }
            else if (isOrange(red, green, blue)) {
                [data[i], data[i + 1], data[i + 2]] = [255, 165, 0];
            }
            else if (isBlack(red, green, blue)) {
                [data[i], data[i + 1], data[i + 2]] = [0, 0, 0];
            } else if (isWhite(red, green, blue)) {
                [data[i], data[i + 1], data[i + 2]] = [255, 255, 255];
            }
            else if (isGray(red, green, blue)) {
                [data[i], data[i + 1], data[i + 2]] = [130, 130, 130];
            }
            else if (Math.max(red, blue, green) === blue) {
                [data[i], data[i + 1], data[i + 2]] = [0, 0, 255];
            } else if (Math.max(red, blue, green) === red) {
                [data[i], data[i + 1], data[i + 2]] = [255, 0, 0];
            } else {
                [data[i], data[i + 1], data[i + 2]] = [0, 255, 0];
            }
        }
        // frame.data = data;
        mirror(data, this.width, this.height);
        this.ctx2.putImageData(frame, 0, 0);
    };

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
            <video ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline muted id="videoElement" style={{ display: "none" }} />
            <canvas id="c1" style={{ display: "none" }}></canvas>
            <canvas id="c2" style={{ width: "133vh", height: "100vh" }}></canvas>
        </div>
    );
}

export default Colors;

import './css/App.css';
import { useEffect, useState } from 'react';
import { SocialIcon } from 'react-social-icons';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import {Link} from 'react-router-dom';
import sketch from './Sketch.js'
import P5Wrapper from 'react-p5-wrapper';

// PUBLIC_URL=https://jakearmendariz-com.web.app/

function Home() {
  const fullText = 'I am a software engineer, CS student, and lover of sushi.';
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowCursor(false), 600);
      }
    }, 3500 / fullText.length);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header className="App-header" >  
        <div className="WallPaper">
            <span className="Welcome">Hello, I'm Jake</span>
            <span className="typewriter-text">
              {displayed}
              {showCursor && <span className="typewriter-cursor" />}
            </span>
            <br />
            <Container className="socialIcons">
                <Row style={{display: 'flex', justifyContent: 'center'}}>
                    <SocialIcon url="https://twitter.com/jakearmendariz3" fgColor="#fafafa" className=".social-icon" />
                    <SocialIcon url="https://github.com/jakearmendariz" bgColor="#fafafa"  className=".social-icon" />
                    <SocialIcon url="https://www.linkedin.com/in/jake-armendariz/" fgColor="#fafafa" className=".social-icon" />
                </Row>
                <Link to="/resume" style={{ position: 'relative', zIndex: 10000}}>
                    <button type="button" className="btn btn-dark btn-lg" style={{margin:'calc(7px + 0.7vw)', zIndex: 10000}}>Resume</button>
                </Link>
                <Link to="/secret" style={{ position: 'relative', zIndex: 10000}}>
                    <button type="button" className="btn btn-dark btn-lg" style={{margin:'calc(7px + 0.7vw)', zIndex: 10000}}>Secret</button>
                </Link>
            </Container>
        </div>
      </header>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex:0,
          pointerEvents: 'none'
        }}
      >
        <P5Wrapper sketch={sketch}></P5Wrapper>
      </div>
    </div>
  );
}

export default Home;

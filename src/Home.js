import './css/App.css';
import Typist from 'react-typist';
import { SocialIcon } from 'react-social-icons';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import {Link} from 'react-router-dom';
import sketch from './Sketch.js'
import P5Wrapper from 'react-p5-wrapper';


function Home() {
  return (
    <div className="App">
      <header className="App-header" >  
        <div className="WallPaper">
            <span className="Welcome">Hi, I am Jake</span>
            <Typist style={{width:'50%', textAlign:'left'}} cursor={{ hideWhenDone: true,  }}>
                I am a software engineer, CS student, and lover of sushi.
            </Typist>
            <br />
            <Container className="socialIcons">
                <Row style={{display: 'flex', justifyContent: 'center'}}>
                    <SocialIcon url="https://twitter.com/jakearmendariz3" fgColor="#fafafa" className=".social-icon" />
                    <SocialIcon url="https://github.com/jakearmendariz" bgColor="#fafafa"  className=".social-icon" />
                    <SocialIcon url="https://www.linkedin.com/in/jake-armendariz/" fgColor="#fafafa" className=".social-icon" />
                </Row>
                <Link to="/resume">
                    <button type="button" className="btn btn-dark btn-lg" style={{margin:'calc(7px + 0.7vw)'}}>Resume</button>
                </Link>
                <Link to="/secret">
                    <button type="button" className="btn btn-dark btn-lg" style={{margin:'calc(7px + 0.7vw)'}}>Secret</button>
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
        }}
      >
        <P5Wrapper sketch={sketch}></P5Wrapper>
      </div>
    </div>
  );
}

export default Home;

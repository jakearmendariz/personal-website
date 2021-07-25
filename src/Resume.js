import './Resume.css';
import {Link} from 'react-router-dom';
import {BiArrowBack} from 'react-icons/bi'
// import View from 'react'


// import Button from 'react-bootstrap/Button'


function Resume() {
  return (
      <div className="background" style ={{backgroundColor:'rgb(13,61,90)'}}>
            <Link to="/home" style={{margin:'20px', paddingTop:'200px'}}><BiArrowBack size={40} style={{color:'white'}}></BiArrowBack></Link>
        <div className="Resume" >
            <h1 className="Resume-header">
                Resume
            </h1>
            <h3>Interests</h3>
            <p>I am fascinated by software. I enjoy writing code, designing architectures, and learning about the complexity within software systems.
                Currently, I am most interested in working with high request per second systems. Along with a personal interest 
                in the Rust Programming languge and the Rust compiler.
            </p>
            {/* <br></br> */}
            <h3>
                Education
            </h3>
            <b>UC Santa Cruz Computer Science</b>
            3.7 GPA: Scholars Program<br></br>
            Courses in Distributed Systems, Embedded OS, System Design, Programming Language Theory, and Databases
            <br></br>
            <br></br>

            <h3>
                Work Experience
            </h3>
            <b>Facebook Fall 2021</b>Team and Project TBD<br />
            <b>Amazon Summer 2021</b>Working on Alexa Device Demos Team. Added support to change Alexa's visual and voice responses 
            towards prohibited intents. Allowing sales and our organizational partners to choose different responses for their organization, 
            or for groups of devices. Working primarily with a Java backend and Python for database migration.

            <b>CDK Summer 2020</b>Engineered a backend in Flask that connects car dealerships with Fortellis API to retrieve and display their
            vehicle inventory, information, and images. Helping CDK compete with online retailers such as Carvana.
            <br></br>
            <br></br>
            <h3>
                Relevant Projects
            </h3>
            <b>Distributed Key Value Store and Load Balancer</b>Designed and engineered a causally consistent, always available, and partition tolerant system.
    Consistent hashing distributes the requests to multiple shards. Within shards, gossip will spread requests.
    Hashing and load balancing written in Rust, data consistency code written in Python.
    <br />
            <b>Deduplicating Fork of Berkeley FFS (spring 2021)</b>Designed and forked a version of the Berkeley Fast File System to handle logical block deduplication.
    Wrote and updated deduped inodes to disk by editing existing newfs, FFS, and UFS code
    All writes, reads, and deletions were sent through an added layer with minimal performance cost to reduce the amount of replicated data on the system.

        <b> Multiplayer Online Game in Rust (summer 2020)</b>
    Implemented game mechanics including player health, object collision, attacks, and movement coordination which is synchronized via an Actix web socket server.

    <b>HTTP server and load balancer (spring 2020)</b>
    Designed and implemented a multi-threaded HTTP server and load balancer in C capable of distributing concurrent requests safely and efficiently.
    <br></br><br></br>
        <h3>Skills</h3>
        <p><b>Profficent Programming Lanugages</b> Rust, Python, C & Java<br></br>
        <b>Experience with</b> Go, Node, C++ & Bash<br></br>
        <b>Operating Systems</b> Linux, Macos & FreeBSD<br></br>
        <b>Developer Tools</b> AWS, Docker, Git, </p>

        </div>
      </div>
  );
}

export default Resume;

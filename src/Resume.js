import './css/Resume.css';
import {Link} from 'react-router-dom';
import {BiArrowBack} from 'react-icons/bi'

function Resume() {
  return (
      <div className="background" style ={{backgroundColor:'rgb(13,61,90)'}}>
            <Link to="/home" style={{margin:'20px', paddingTop:'200px'}}><BiArrowBack size={40} style={{color:'white'}}></BiArrowBack></Link>
        <div className="Resume" >
            <h1 className="Resume-header">
                Resume
            </h1>
            <p>
                Hi, I am a software engineer and computer science student. 
                My goal is to find meaningful work through complex systems and elegant solutions. 
                I hope to bond with my company/team over coffee and contribute with beautiful code.
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
            <b>Google SWE</b>
                Working on Google Drive starting October 3rd.
            <br />
            <b>Facebook Fall 2021</b>
                Built process trees to assist in invesitgating malware detected by MsDefender.
                Collaborated with Security Engineers and product to create a good UI and fast execution.
            <br />
            <b>Amazon Summer 2021</b>
                Worked on managed Alexa devices, adding a feature to allow 
                stakeholders to instantly customize the response to restricted behaviors. Migrated ten 
                thousand live devices, deployed all around the US and soon internationally.
            <b>CDK Summer 2020</b>
                Engineered a backend in Flask that connects car dealerships with Fortellis API to retrieve and display their
                vehicle inventory, information, and images. Helping CDK compete with online retailers such as Carvana.
            <br></br>
            <br></br>
            <h3>
                Relevant Projects
            </h3>
            <b>Distributed Key Value Store and Load Balancer</b>
                Designed and engineered a causally consistent, always available, and partition tolerant system.
                Consistent hashing distributes the requests to multiple shards. Within shards, gossip will spread requests.
                Hashing and load balancing written in Rust, data consistency code written in Python.
            <br />
            <b>Deduplicating Fork of Berkeley FFS (spring 2021)</b>
            Engineered a fork of the Berkeley Fast File System to handle logical block deduplication.
            All reads and writes are hashed and deduped, increasing storage capacity with added minimal latency.

            <b> Multiplayer Online Game from Scratch (summer 2020)</b>
            Implemented game mechanics including player health, object collision, attacks, and movement coordination which is synchronized via an rust Actix web socket server.

    <b>HTTP server and load balancer (spring 2020)</b>
    Designed and implemented a multi-threaded HTTP server and load balancer in C capable of distributing concurrent requests safely and efficiently.
    <br></br><br></br>
        <h3>Skills</h3>
        <p><b>Profficent Programming Lanugages</b> Rust, Python, C & Java<br></br>
        <b>Experience with</b> Go, Haskell, C++, Node & Bash<br></br>
        <b>Interested in</b> Systems Programming, Distributed Systems, Security & PL <br></br>
        <b>Developer Tools</b> AWS, Linux, Docker & Git</p>

        </div>
      </div>
  );
}

export default Resume;

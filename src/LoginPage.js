
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { Button, Row, Col, Form } from "react-bootstrap";
const LoginPage = ({ admin, setAdmin }) => {
  
  const auth = getAuth();
async function handleLogin(event) {
 
    try {
       event.preventDefault();
      const userCredential = await signInWithEmailAndPassword(auth, event.target.Email.value, event.target.password.value);
      setAdmin(userCredential.user);
      alert("Logged in successfully!");
      return
    } catch (error) {
      console.error("Error logging in: ", error);
      alert("Login failed. Please check your credentials."+error);
    }
  };

  if (admin) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6">Admin Login</h2>
      <Form style={{color : 'white'}} onSubmit={handleLogin}>
                                            <Row>
                                                <Col>
                                                <Form.Group controlId="Email">
                <Form.Label className="FormLabel">
                  Email<font color="#ff0000">*</font>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  name="Email"
                  required
                 
                ></Form.Control>
              </Form.Group>
                                               
                                                </Col>
                                                <Col><Form.Group controlId="password">
                <Form.Label className="FormLabel">Name <font color="#ff0000">*</font></Form.Label>
                <Form.Control
                 type="password"
        placeholder="Password"
                 required
                  name="password"
                ></Form.Control>
              </Form.Group>
                                                </Col>
                               <Col>
                            <Button style={{marginTop:'33px'}} variant="primary"
        className="button" type="submit"
       
      >
        Login
      </Button></Col>
                       </Row>
                                          </Form>
     
      
    </div>
  );
};

export default LoginPage;
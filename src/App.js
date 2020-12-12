import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';


if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig); // ata kora hoise karon prothom a dhuktei site tate error dhkehay
};

function App() { 
  const boxStyle = {
    height: '50px',
    width: '500px',
    marginTop: '20px'
  }
  const [newUser, setNewUser] = useState(false) //checkbox ar conditionally input 
  const [user, setUser] = useState({
    email: '',
    password: '',
    name: '',
    error: '',
    success: false
  });

  // const provider = new firebase.auth.GoogleAuthProvider();

  //just email and pass r field ta valid kina check korar jnno
  const handleBlur = (e) =>{
    //event ta jkhn thke trigger hyece seta hcce event.r j element thke trigger hcce seta hcce se element hcce target
    let isFieldValid = true;
    if(e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value); //isEmailValid true or false return krbe..
    }
    if(e.target.name === 'password'){
    const isPasswordValid = e.target.value.length > 6;
    const isPasswordHasNumber = /\d{1}/.test(e.target.value);
    
    isFieldValid = isPasswordValid && isPasswordHasNumber;

    }

    //jhtu amra dhre nici by default form ta valid.tai name ta o show kore onBlur krle
    if(isFieldValid){
      //[cart, setCart]
      const newUserInfo = {...user}//user r info copy kora..second bracket cz obj duitai
      newUserInfo[e.target.name] = e.target.value; //password / email r updated value assign kore dewa obj ee
      setUser(newUserInfo)
    }
  }
    
  const handleSubmit = (r) =>{ // r ta preventDefault ar peramiter hisabe
    // console.log(user.email, user.password);
   if(newUser && user.email && user.password){
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password) //firebase password authentication theke ansi.
    .then( res => { //jodi success hoy
      const newUserInfo = {...user}; //  ager error msg ta soraya success likbe niser line ghulo..return a conditionally set korbo
      newUserInfo.error = '';
      newUserInfo.success = true;
      setUser(newUserInfo);
      updateUserName(user.name); // ata korsi user ar name ta dhorte name = mail, password
    })
    .catch((error) => {
      const newUserInfo = {...user}
      newUserInfo.error = error.message; //default vabe ekta error msg ase firebase a ota dhkabe..
      newUserInfo.success = false; //error ta dhakabe jeta return a conditionally set korbo
      setUser(newUserInfo);
  
    });
   }


    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res=> {
    const newUserInfo = {...user};
      newUserInfo.error = '';
      newUserInfo.success = true;
      setUser(newUserInfo);
      console.log('sign in user info', res.user);
  })
  .catch((error) => {
    const newUserInfo = {...user}
      newUserInfo.error = error.message;
      newUserInfo.success = false; 
      setUser(newUserInfo);
  });
  }

   r.preventDefault(); //ata dile pura page ta ar reload nibena
  }


  //user ar name pete niser tuku korar
  const updateUserName = name =>{
    const user = firebase.auth().currentUser;
   user.updateProfile({
   displayName: name, 
  })
  .then(function() {
   console.log('user name updated successfully')
 })
 .catch(function(error) {
   console.log(error)
 });
  }
 
  return (
    <div className="App">
      <h1>our own Authentication</h1>
      {/* <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>password: {user.password}</p> */}

      <form onSubmit={handleSubmit}>
        <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/>
        <label htmlFor="newUser">NEW USER SIGN UP</label> <br/>
       { newUser && <input style={boxStyle} type="text" name="name" placeholder="Your name" onBlur={handleBlur}/>} <br/>
        <input style={boxStyle} onBlur={handleBlur} type="text" name="email" placeholder="type your email" required/> <br/>
        <input style={boxStyle} onBlur={handleBlur}  type="password" name="password" placeholder="type your password must be use number & word "  required/> <br/>
        <input style={boxStyle} type="submit" value={newUser ? 'Sign up' : 'Sign in'}/>
      </form>

      <p style={{color: 'red'}}>{user.error}</p>
      { user.success && <p style={{color: 'green'}}>User {newUser ? 'Created' : 'Logged In'} successfully</p>}
    </div>
  );
}

export default App;
//input submit use korle se puro form r shob info niye tarpor form ta k submit korbe...kntu buttob submit ta korbe na form r sthe button submit r kno jogsajosh nai
//ekhn handleblur function e amra j field ta k update kortesi seta useState e giye notun kore object property te update korte hbe...tai amra object ta k copy korlam
//trpor value update korlam 'name' hisebe.name ta email o ht e pare abr pass o hte pare..depend korbe amra kn field ta 
//change kore blur krteci

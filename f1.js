
const Users={}

Users["k"]="k"
var intro = new Audio('./sounds/intro.mp3')
currentOnline=null


function LoginFormShow()
{

    $(".welcomePage").css("display","none")
    $("#Login").css("display","block");
    $("#Register").css("display","none");
    $(".settings").css("display","none");
    $(".GameScreen").css("display","none")
    
   
}

function showRegisterForm(){

    $(".welcomePage").css("display","none")
    $("#Login").css("display","none");
    $("#Register").css("display","block");
    $(".settings").css("display","none")
    $(".GameScreen").css("display","none")



}
function ShowWelcomePage()
{

    $(".welcomePage").css("display","block")
    $("#Login").css("display","none");
    $("#Register").css("display","none");
    $(".settings").css("display","none");
    $(".GameScreen").css("display","none")
   

}

function ShowSettings()
{
  $(".welcomePage").css("display","none")
    $("#Login").css("display","none");
    $("#Register").css("display","none");
    $(".settings").css("display","block")
    $(".GameScreen").css("display","none")
    intro.play()
    intro.loop = true
}



function signIn()
{
let userName=$("#LoginUsername").val()
let passWord = $("#LoginPassword").val()

if(userName in Users){    
  if(Users[userName].localeCompare(passWord) === 0){

    currentOnline=userName
    document.getElementById("playerUserName").innerHTML="User: "+userName
    ShowSettings();

  }
  else 
  {
    alert("Wrong Password");
    return 
  }
}
else
{
  alert("User Name Doesn't Exists");
  return 
}


}


function signUp()
{

  if($("#SignUpForm").valid())
  {
    let newUser=$("#Username").val();
  
    let pass= $("#Password").val();
    Users[newUser]=pass;
   
    alert("Signed Up Sucessfuly!")
    ShowWelcomePage()
  }


}
jQuery.validator.addMethod("lettersonly", function(value, element) 
{
return this.optional(element) || /^[a-z ]+$/i.test(value);
}, "Letters and spaces only please");


jQuery.validator.addMethod("myPasswordCheck", function(value, element) 
{
return this.optional(element) || /(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/i.test(value);
}, "Letters and spaces only please");


$().ready(function()
{

  $("#SignUpForm").validate(
    {
      rules:{
        Username:{
          required: true,
          
        },
        Password:{
          required: true,
          minlength:6,
          myPasswordCheck:true,

        }
        ,
        FullName:
        {
          lettersonly:true,
        }
        ,
        email:{
          required:true,
          email:true
        }
      }
    }
   
  )




});

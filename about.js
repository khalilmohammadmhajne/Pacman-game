


var span=$(".close")

function showAbout()

{$(".modal").css("display","block")
console.log("fuvl")
}

function closeModal()
{
    $(".modal").css("display","none")
}
window.onclick = function(event) {
    
  //console.log(event.target)
  console.log($("#myModal"))
    if ($(event.target).hasClass("modal") ) {
        $(".modal").css("display","none") 
      
    }
    
  }

 

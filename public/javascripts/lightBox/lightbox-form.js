

function gradient(id, level)
{
	var box = document.getElementById(id);
	box.style.opacity = level;
	box.style.MozOpacity = level;
	box.style.KhtmlOpacity = level;
	box.style.filter = "alpha(opacity=" + level * 100 + ")";
	box.style.display="block";
	return;
}


function fadein(id) 
{
	var level = 0;
	while(level <= 1)
	{
		setTimeout( "gradient('" + id + "'," + level + ")", (level* 1000) + 10);
		level += 0.01;
	}
}


// Open the lightbox


function openbox(fadin, shadowId, boxId)
{
  var box = document.getElementById(boxId); 
  document.getElementById(shadowId).style.display='block';
  
  if(fadin)
  {
	 gradient(boxId, 0);
	 fadein(boxId);
  }
  else
  { 	
    box.style.display='block';
  }  	
}


// Close the lightbox

function closebox(shadowId, boxId)
{
   document.getElementById(boxId).style.display='none';
   document.getElementById(shadowId).style.display='none';
}




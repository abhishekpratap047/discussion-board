/* DOM References */
addquestionbutton = document.getElementById("addquestionbutton");
newtopictext = document.getElementById("newtopictext");
newdescriptiontext = document.getElementById("newdescriptiontext");
questionlistwrapper = document.getElementById("questionlistwrapper");
questionexpand = document.getElementById("questionexpand");
askquestionwrapper = document.getElementById("askquestionwrapper");
newquestion = document.getElementById("newquestion");
topictext = document.getElementById("topictext");
rightdescription = document.getElementById("rightdescription");
resolvebutton = document.getElementById("resolvebutton");
searchbox = document.getElementById("searchbox");
mycomment = document.getElementById("mycomment");
yourname = document.getElementById("yourname");
addcommentbutton = document.getElementById("addcommentbutton");
commentwrapper = document.getElementById("commentwrapper");

newquestion.addEventListener("click", () => {
  questionexpand.style.display = "none";
  askquestionwrapper.style.display = "flex";
  newtopictext.value = "";
  newdescriptiontext.value = "";
});

/*render list items on window load*/

function windowload() {
  for (let i = 0; i < localStorage.length; i++) {
    let data = localStorage.getItem(localStorage.key(i));
    let objdata = JSON.parse(data);
    if(objdata.topic!=undefined){
      rendertopics(objdata.topic);
    }
    
  }
}

windowload();

function rendercomments(objcomment) {
  commentbox = document.createElement("div");
  commentwrapper.prepend(commentbox);
  commentbox.innerHTML = `<div style="color:rgb(41, 170, 153"><b>${objcomment.name} :</b></div> ${objcomment.comment}`;
  commentbox.classList.add("commentblock");
}

/*right pane defaults to ask question page*/
questionexpand.style.display = "none";
askquestionwrapper.style.display = "flex";

/* Adds a topic block in localStorage*/
function addtollocalstorage(topic, description) {
  const question = {
    topic: topic,
    description: description,
    comments: [],
  };
  localStorage.setItem(question.topic, JSON.stringify(question));
}

/* Add a new topic */
addquestionbutton.addEventListener("click", () => {
  let topic = newtopictext.value;
  let description = newdescriptiontext.value;
  if (topic != "" && description != "") {
    addtollocalstorage(topic, description);
    rendertopics(topic);
    newtopictext.value = "";
    newdescriptiontext.value = "";
  } else {
    console.log("add topic and description both before adding");
  }
});

/* Renders one item to the question list in left pane */
function rendertopics(topic) {
  let listitem = document.createElement("button");
  questionlistwrapper.prepend(listitem);
  listitem.innerHTML = topic;
  listitem.classList.add("questionblock");

  listitem.addEventListener("click", () => {
    questionexpand.style.display = "flex";
    askquestionwrapper.style.display = "none";
    searchstring = listitem.innerHTML;
    let data = localStorage.getItem(searchstring);
    dataobj = JSON.parse(data);
    topictext.innerHTML = dataobj.topic;
    rightdescription.innerHTML = dataobj.description;

    /*remove previous comments*/

    while (commentwrapper.firstChild) {
      commentwrapper.removeChild(commentwrapper.firstChild);
    }

    /*create dynamic comment*/
    let populatearray = dataobj.comments;
    for (let i = 0; i < populatearray.length; i++) {
      rendercomments(populatearray[i]);
    }

    resolvebutton.addEventListener("click", () => {
      let identifierstring = topictext.innerHTML;
      localStorage.removeItem(identifierstring);
      while (questionlistwrapper.firstChild) {
        questionlistwrapper.removeChild(questionlistwrapper.firstChild);
      }
      windowload();
      questionexpand.style.display = "none";
      askquestionwrapper.style.display = "flex";
    });
  });
}

searchbox.addEventListener("keyup", (e) => {
  if (searchbox.value != "") {
    while (questionlistwrapper.firstChild) {
      questionlistwrapper.removeChild(questionlistwrapper.firstChild);
    }
    for (let i = 0; i < localStorage.length; i++) {
      let data = localStorage.getItem(localStorage.key(i));
      let objdata2 = JSON.parse(data);
      if (
        objdata2.topic.toLowerCase().includes(searchbox.value.toLowerCase())
      ) {
        rendertopics(objdata2.topic);
      }
    }
  } else {
    while (questionlistwrapper.firstChild) {
      questionlistwrapper.removeChild(questionlistwrapper.firstChild);
    }
    windowload();
  }
});

addcommentbutton.addEventListener("click", () => {
  if (mycomment.value != "" && yourname.value != "") {
    /*Add to localStorage */
    let comment = mycomment.value;
    let name = yourname.value;
    let objstring = localStorage.getItem(topictext.innerHTML);
    let obj = JSON.parse(objstring);
    commentarray = { name, comment };
    obj.comments.push(commentarray);
    localStorage.setItem(topictext.innerHTML, JSON.stringify(obj));
    mycomment.value = "";
    /*Render new comment*/
    rendercomments(commentarray);
  }
});

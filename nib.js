
Router.map(function() { 
 
  this.route('nib', { path: '/' });  

  this.route('nib', { path: '/:qid',
    data: function() { return { qid: this.params.qid } }
  });

});

//==========================================================

Questions = new Meteor.Collection('questions');
// Questions.insert({ qid:"138ef8", text:"what is 9 * 6"  });

Answers = new Meteor.Collection('answers');
// Answers.insert({ qid:"138ef8", text:"42"  });

//==========================================================

var enabled = function(button) {
  button.enable = function() {
    this.removeAttr("disabled");
  };
  button.disable = function() {
    this.attr("disabled", "disabled");
  };
  return button;
};

//==========================================================

var question = {    
  text:function() {
    return $(".question #text").val();
  },
  button:function() {
    return enabled($(".question #button"))
  }
};

var answer = {
  text:function(arg) {
    var node = $(".answer #text");
    if (arg !== undefined) { node.val(arg); }
    return node.val();
  },
  button:function() {
    return enabled($(".answer #button"))
  } 
};

var valid = function(qid) {
  return Questions.findOne({ qid:qid });
};

//==========================================================

if (Meteor.isClient) {
    
  Template.question.readonly = function() {
    return valid(this.qid) ? "readonly" : "";     
  };
  Template.question.text = function() {    
    var one = Questions.findOne({ qid:this.qid });
    return one ? one.text : "";
  };
  Template.question.disabled = function() {
    return (valid(this.qid) || question.text() !== "") ? "disabled='disabled'" : ""; 
  };
  Template.question.events({"keyup .question #text":function() {
    if (!valid(this.qid) && question.text() !== "") {
      question.button().enable();
    } else {
      question.button().disable();
    }
  }});
  Template.question.events({"click .question #button":function () {  
    var one = { qid:Random.hexString(6), text:question.text() };
    Questions.insert(one);
    window.open('/' + one.qid);
  }});

  
  Template.answer.readonly = function() {
    return valid(this.qid) ? "" : "readonly";         
  };
  Template.answer.disabled = function() {
    return valid(this.qid) ? "" : "disabled='disabled'";
  };  
  Template.answer.events({"click .answer #button":function () {
    var text = answer.text();
    if (text !== "") {
      var one = { qid:this.qid, text:text };
      Answers.insert(one);
      answer.text("");
    }
  }});
 
  Template.nib.answers = function() {
    return Answers.find({ qid: this.qid });
  };
  
}

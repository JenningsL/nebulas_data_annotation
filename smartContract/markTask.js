"use strict";

var TaskItem = function(obj) {
  if (obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.description = obj.description;
    this.type = obj.type;
    this.data = obj.data;
    this.publisher = obj.publisher;
    this.reward = obj.reward;
    this.options = obj.options;
    this.validateNum = obj.validateNum || 1;
  } else {
    throw new Error("no data provided");
  }
};

TaskItem.prototype = {
  toString: function() {
    return JSON.stringify(this);
  }
};

var AnswerItem = function(obj) {
  if (obj) {
    this.id = obj.id;
    this.taskId = obj.taskId;
    this.answer = obj.answer;
    this.author = obj.author;
    this.timestamp = Math.round(new Date().getTime() / 1000);
  } else {
    throw new Error("no data provided");
  }
};

AnswerItem.prototype = {
  toString: function() {
    return JSON.stringify(this);
  }
};

var MarkTask = function() {
    LocalContractStorage.defineMapProperty(this, "tasks");
    LocalContractStorage.defineProperty(this, "size");
    LocalContractStorage.defineMapProperty(this, "answers");
    LocalContractStorage.defineProperty(this, "answerSize");
};

MarkTask.prototype = {
    init: function() {
        this.size = 0;
        this.answerSize = 0;
    },

    getTask: function(key) {
        key = key.trim();
        if ( key === "" ) {
            throw new Error("empty key");
        }
        var task = this.tasks.get(key);
        var correctAnswers = this._getCorrectAnswers(key);
        task.answerNum = correctAnswers.length;
        return task;
    },

    getTasks: function(publisher) {
      var result = [];
      for (var i = 0; i < this.size; i++) {
        var task = this.tasks.get(i);
        if (publisher && task.publisher !== publisher) {
          continue;
        }
        var correctAnswers = this._getCorrectAnswers(i + "");
        task.answerNum = correctAnswers.length;
        task.correctAnswers = correctAnswers;
        result.push(task);
      }
      return result;
    },

    publish: function(task) {
        var publisher = Blockchain.transaction.from;
        var reward = Blockchain.transaction.value;
        var key = this.size++;

        var taskItem = new TaskItem(Object.assign(task, {
          id: key + "",
          publisher: publisher,
          reward: reward
        }));

        this.tasks.put(key, taskItem);
    },

    _getCorrectAnswers: function(taskId)  {
      var task = this.tasks.get(taskId);
      var groups = {};
      for (var i = 0; i < this.answerSize; i++) {
        var ans = this.answers.get(i);
        if (ans.taskId !== taskId) {
          continue;
        }
        if (!(ans.answer in groups)) {
          groups[ans.answer] = {
            latestSubmit: ans.timestamp,
            answers: [ans]
          }
        } else {
          groups[ans.answer].answers.push(ans);
          if (ans.timestamp > groups[ans.answer].latestSubmit) {
            groups[ans.answer].latestSubmit = ans.timestamp;
          }
        }

      }
      var passGroups = Object.values(groups).filter(function(g) {
        return g.answers.length >= task.validateNum
      });
      if (passGroups.length === 0) {
        return [];
      }
      passGroups.sort(function(a, b) {
        return a.latestSubmit - b.latestSubmit
      });
      return passGroups[0].answers;
    },

    answer: function(taskId, answer) {
      var author = Blockchain.transaction.from;
      var userTasksIds = this.getAnswers(null, author).map(function(ans) {
        return ans.taskId;
      });
      if (userTasksIds.includes(taskId)) {
        throw new Error("Already answered this task.");
      }
      var task = this.tasks.get(taskId);
      if (!task) {
        throw new Error("Task not exist.");
      }
      if (this._getCorrectAnswers(taskId).length) {
        throw new Error("Task already completed.");
      }
      var key = this.answerSize++;

      var answerItem = new AnswerItem({
        id: key + "",
        taskId: taskId,
        author: author,
        answer: answer
      });

      this.answers.put(key, answerItem);

      var correctAnswers = this._getCorrectAnswers(taskId);
      if (correctAnswers.length >= task.validateNum) {
        var reward = task.reward / correctAnswers.length;
        correctAnswers.forEach(function(ans) {
          var result = Blockchain.transfer(ans.author, reward);
          if (!result) {
            throw new Error("transfer failed.");
          }
        })
      }
    },

    getAnswers: function(taskId, author) {
      let answers = [];
      for (var i = 0; i < this.answerSize; i++) {
        var ans = this.answers.get(i);
        if (taskId && ans.taskId !== taskId) {
          continue;
        }
        if (author && ans.author !== author) {
          continue;
        }
        var correctIds = this._getCorrectAnswers(ans.taskId).map(function(ans) {
          return ans.id;
        });
        if (correctIds.includes(i + "")) {
          ans.validated = true;
        } else {
          ans.validated = false;
        }
        ans.task = this.tasks.get(ans.taskId);
        answers.push(ans);
      }
      return answers;
    }
};

module.exports = MarkTask;

/* ============================================================
   api.js — Fetch wrappers for CareerCraft AI REST endpoints
   ============================================================ */

var API = (function () {
  'use strict';

  var BASE = '/api';

  function post(path, body) {
    return fetch(BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().then(function (data) {
        data._status = res.status;
        return data;
      });
    });
  }

  function get(path) {
    return fetch(BASE + path, {
      credentials: 'same-origin'
    }).then(function (res) {
      return res.json().then(function (data) {
        data._status = res.status;
        return data;
      });
    });
  }

  return {
    signup: function (name, email, password) {
      return post('/auth/signup', { name: name, email: email, password: password });
    },
    login: function (email, password) {
      return post('/auth/login', { email: email, password: password });
    },
    logout: function () {
      return post('/auth/logout', {});
    },
    me: function () {
      return get('/auth/me');
    },
    runTool: function (tool, input) {
      return post('/tool/run', { tool: tool, input: input });
    },
    getHistory: function () {
      return get('/history');
    },
    deleteHistory: function (id) {
      return fetch(BASE + '/history/' + id, {
        method: 'DELETE',
        credentials: 'same-origin'
      }).then(function (res) {
        return res.json().then(function (data) {
          data._status = res.status;
          return data;
        });
      });
    }
  };
})();

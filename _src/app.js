
console.log("%cWelcome from aziis98!", "font-size: x-large");

const app = new Vue({
   el: '#app',
   created: function () {
      const website = new Request('/website.json');

      fetch(website).then(res => res.json()).then(data => {
          this.posts = data.posts.filter(it => !(it.hidden === "true"));
        //   console.log(data);
      });
   },
   data: {
      message: 'Hello from aziis98!',
      posts: [],
   }
});
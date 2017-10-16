
console.log("Hello from aziis98!");

const app = new Vue({
   el: '#app',
   created: function () {
      const website = new Request('/website.json');

      fetch(website).then(res => res.json()).then(data => {
         console.log(data);
         
         this.posts = data.posts;
      });
   },
   data: {
      message: 'Hello from aziis98!',
      posts: [],
   }
});
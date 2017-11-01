
console.log('Loading article named "' + window.location.hash.substring(2) + '"');

const app = new Vue({
    el: '#app',
    created: function () {

        const articleFile = window.location.hash.substring(2);

        fetch('/_posts/' + articleFile).then(it => it.text()).then(raw => {
            this.document = marked(raw);

            setTimeout(() => {
                console.log('Rendering LaTeX...');
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, ".article"]);
            }, 250);
        });
    },
    data: {
        document: '',
        message: 'Un messaggio importante è scritto qui',
    }
});
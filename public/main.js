const app = new Vue({
    el: '#app',
    data: {
        url: '',
        slug: '',
        error: '',
        created: null,
    },
    methods: {
        async createUrl(){
            this.error='';
            console.log(this.url, this.slug);
            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    url: this.url,
                    slug: this.slug || undefined,
                })
            });
           if(response.ok){
                const result = await response.json();
                this.created = `http://localhost:7000/${result.slug}`;
           }else if (response.status === 429) {
            this.error = 'You are sending too many requests. Try again in 30 seconds.';
          } else {
            const result = await response.json();
            this.error = result.message;
          }
        }
    }
});
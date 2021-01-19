const app = new Vue({
    el: '#app',
    data: {
        url: '',
        slug: '',
        created: null,
    },
    methods: {
        async createUrl(){
            console.log(this.url, this.slug);
            const response = await fetch('/url', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    url: this.url,
                    slug: this.slug,
                })
            });
           if(response.ok){
                const result = await response.json();
                this.formVisible = false;
                this.created = `https://themustardcat.in/${result.slug}`;
           }
        }
    }
});
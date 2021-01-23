const app = new Vue({
    el: '#app',
    data: {
        url: '',
        slug: '',
        error: '',
        token: '',
        created: null,
    },
    methods: {
        async createUrl(){
            this.error='';
            const tokenRes = await fetch('/',{
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    token: this.token || undefined
                }),
            })
            let k = await tokenRes.json()
            const response = await fetch('/noob', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${k.token}`
                },
                body: JSON.stringify({
                    url: this.url,
                    slug: this.slug || undefined,
                }),
            });
            console.log(response);
           if(response.ok){
                const result = await response.json();
                this.created = `${window.location.href}${result.slug}`;
           }else if (response.status === 429) {
            this.error = 'You are sending too many requests. Try again in 30 seconds.';
          } else {
            const result = await response.json();
            this.error = result.message;
          }
        },
    },
});


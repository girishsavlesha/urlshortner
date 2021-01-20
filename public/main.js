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
            const response = await fetch('/noob', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InVrQXVXNGhrc2pRSWpHWTVYYThRcSJ9.eyJpc3MiOiJodHRwczovL2Rldi1tbmJjLW53by51cy5hdXRoMC5jb20vIiwic3ViIjoiSnRYYWs1a0lKTndVWnVDQlFtTEF3cVZOYlB4bjVpS0RAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vbm9vYi5tZSIsImlhdCI6MTYxMTE1NDQ1MCwiZXhwIjoxNjExMjQwODUwLCJhenAiOiJKdFhhazVrSUpOd1VadUNCUW1MQXdxVk5iUHhuNWlLRCIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.g39iTVupD8i9KbranV9uDgVnV1t8xZx4Pjqm4_PhaswEMu_939sgy7fcSwvP5LYhQXOQCWUGiQ_fGCZ_biDd0Ey23Cns1RRYSO_OFXpAQ1hE3f0VTuDqZ0b1HjC2N4m3YqGj11EKhgAGWhC9vOFr9wIC-cHqNDWPNVMhFEnfxxaj1gZoKKLd_QJ4GQdRqWK0A6XfJpFc5P5UKeMnAO3kMZm8EyjoSaW7PHiFdD5DB78ywnAjmbve5XlVj17FpPp-zS5_6LHcZGoTwD-OC3wWA1_vZE8LD_Dv51cwND92A2FVuo_B4oqfpxAes4iDeYonKyR4N3Js4o6tuIhiBnqX6g'
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
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
                    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InVrQXVXNGhrc2pRSWpHWTVYYThRcSJ9.eyJpc3MiOiJodHRwczovL2Rldi1tbmJjLW53by51cy5hdXRoMC5jb20vIiwic3ViIjoiSnRYYWs1a0lKTndVWnVDQlFtTEF3cVZOYlB4bjVpS0RAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vbm9vYi5tZSIsImlhdCI6MTYxMTI1MTcwMywiZXhwIjoxNjExMzM4MTAzLCJhenAiOiJKdFhhazVrSUpOd1VadUNCUW1MQXdxVk5iUHhuNWlLRCIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.06WbLejD7Di093KNoEd0CSqvlefpz3MlGEanTFxl8wI4eVp2p0RogjBOFWbHdeWkZsQeGME1I2DDQjJJFxRvLI0ZlmfTy3vws6I8Fy9z4I9VlZiN0Tb2UUXIzdOFEmiv_Ky8r7Sh72I4l3CqMcYODCUSYknHdOIo10zEWbP9i9QQUMjr9n2vui-c8zoFtB9ads5OIJyhD59jPBqyH9AhGLDFNdCxpRNF-BpzclSZWEinB0lJU6LVF-467EmvJya4OhCrEsz4Pg5w6NrvBvgt6VGuAVk_r7OHPtf8YhoDvj9_nT5iai66Addl4bGX0Ak24w1A7Md18KopXY5oGJK0kw'
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
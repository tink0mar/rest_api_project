

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router')

const app = new Koa();

const router = new Router({
    prefix: '/icecreams'
});

// ice cream database
let iceCreams = [];

app.use(bodyParser());
app.use(router.routes());


function checkIceCream(iceCream){

    for (let i = 0; i < iceCreams.length; i++){
        if ( 
            iceCreams[i].id == iceCream.id &&
            iceCreams[i].name == iceCream.name &&
            iceCreams[i].amount == iceCream.amount
        ) {
            return true;
        }
    }

    return false;
}


// return icecream by id

router.get('/:id', async (ctx) => {
    
    let currentIceCream = iceCreams.find(iceCream => {
        return ctx.params.id == iceCream.id;
    })

    if (!currentIceCream) {
        ctx.response.status = 404;        
        ctx.response.body = 'Not Found';
    } else {
        ctx.response.status = 200;
        ctx.body = currentIceCream;
    }

});

// return all ice creams

router.get('/', async(ctx) => {

    ctx.response.status = 200;
    ctx.response.body = iceCreams;

});

// create new record for ice cream

router.post('/new', async(ctx) => {

    if (
		!ctx.request.body.id ||
		!ctx.request.body.name ||
        !ctx.request.body.amount
	) {
		ctx.response.status = 400;
		ctx.body = 'Please enter data for ice cream';
	} else {

        if (checkIceCream(ctx.request.body)){

            ctx.response.status = 202;
            ctx.body = 'Ice cream exists already';

        } else {
            iceCreams.push({
                id: ctx.request.body.id,
		    	name: ctx.request.body.name,
                amount: ctx.request.body.amount
            });

            ctx.response.status = 201;
		    ctx.body = `New ice cream added with id: ${ctx.request.body.id} & name: ${
		    	ctx.request.body.name
		    }`;

        }
    }
})

// change name and amount of ice cream by id

router.put('/update', async(ctx) => {
    

    if (
        !ctx.request.body.id || 
        !ctx.request.body.name ||
        !ctx.request.body.amount
    ){

        ctx.response.status = 400;
        ctx.response.body = "Please enter right data for changing ice cream";

    } else {
        
        let indexIceCream = iceCreams.findIndex(iceCream => {
            return iceCream.id == ctx.request.body.id;
        });
        
        if (indexIceCream >= 0){

            iceCreams[indexIceCream].amount = ctx.request.body.amount;
            iceCreams[indexIceCream].name = ctx.request.body.name;
            
            ctx.response.status = 204;

        } else {
            ctx.response.status = 400;
            ctx.response.body = "Please enter right data for changing an ice cream";
        }

    }
});

//delete ice cream

router.delete('/delete/:id', async(ctx) => {

    const indexIceCream = iceCreams.findIndex(iceCream => {
        return iceCream.id == ctx.params.id;
    });

    if (indexIceCream >= 0){
        iceCreams.splice(indexIceCream, 1);
        ctx.response.status = 200;
        ctx.body = "Deletion was successful";
    } else {
        ctx.response.status = 202;
        ctx.body = "Ice cream does not exists";
    }

});

app.listen(3000);

module.exports=(theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };

/* (routeHandler)=>{
    return async function(req ,res ,nxt){
        try{
            await routeHandler(req ,res)
        }catch(err){
             nxt(err)
        }
    }
 } */

import updateStyle from './update.module.css';
import { updateDetails,getGame,getCacheGame,updateGame, updateGenres, updatePlatforms,getGenres,getPlatforms} from '../actions/actions';
import {connect} from 'react-redux';
import {useHistory} from 'react-router-dom'
import {useState, useEffect} from 'react'
import { validate } from './validate';


function Update(props){




    useEffect(()=>{
        let arr=[]
        if(props.game){
            arr=[...props.game.genres.map(e=> e.name),...props.game.platforms.map(e=> e.name)]
            
        }
     
        props.updateGenres([...props.genres.filter(e=>!arr.includes(e.name))])
        props.updatePlatforms([...props.platforms.filter(e=>!arr.includes(e.name))])
       

    },[props.game])

 

    const [alert, setAlert]=useState({
        name:false,
        image:false,
        description:'hidden',
        platforms:false,
        genres:false,
        redFlag:false,
        greenFlag:false,
       
    })

    let history=useHistory()
    function handleUpdate(){

        if(alert.name===true||alert.image===true||alert.description!=='hidden'||alert.platforms===true||alert.genres===true){
            
            setAlert({...alert,redFlag:false})
            setAlert({...alert,redFlag:true})

        }else{
            props.updateGame(props.game,props.game.id)
            setAlert({...alert,greenFlag:false})
            setAlert({...alert,greenFlag:true})
   
        }
    }
    function handleCancel(){
        props.getCache()
        
        history.goBack()
    }
    function handleChange(e){
        props.updateDetails({...props.game,[e.target.name]:e.target.value })

        setAlert({...alert,[e.target.name]:validate({
            ...props.game,[e.target.name]:e.target.value
           },e.target.name)})
    }

    function inputPlatforms(num){
        num&&props.updateDetails({...props.game,platforms:[...props.game.platforms,{name:''}]})
        if(!num&&props.game.platforms.length>1){
            let aux=props.game.platforms[props.game.platforms.length-1].name
            if(aux){
                props.updatePlatforms([...props.platforms,{name:aux}])
            }
            props.updateDetails({...props.game,platforms:props.game.platforms.slice(0,-1)})
        }

    }
    function inputGenres(num){
        num&&props.updateDetails({...props.game,genres:[...props.game.genres,{name:''}]})
        if(!num&&props.game.genres.length>1){
           
            let aux=props.game.genres[props.game.genres.length-1].name
            if(aux){
                props.updateGenres([...props.genres,{name:aux}])
            }
            props.updateDetails({...props.game,genres:props.game.genres.slice(0,-1)})
        }

    }
    function handlePlatformsChange(e){
        const platforms = [...props.game.platforms];
        let aux=props.game.platforms[e.target.id][e.target.dataset.name]
        props.updatePlatforms([...props.platforms.filter(platforms=>platforms.name!==e.target.value),{name:aux}])
        platforms[e.target.id][e.target.dataset.name] = e.target.value;
        props.updateDetails({...props.game,platforms:[...platforms]});
        // validate
        setAlert({...alert,platforms:validate({
            ...props.game,platforms:e.target.value
           },'platforms')})
    }
    function handleGenresChange(e){
       
        const genres = [...props.game.genres];
        let aux=props.game.genres[e.target.id][e.target.dataset.name]
        props.updateGenres([...props.genres.filter(genre=>genre.name!==e.target.value),{name:aux}])
        genres[e.target.id][e.target.dataset.name] = e.target.value;
        props.updateDetails({...props.game,genres:[...genres]});
            // validate
        setAlert({...alert,genres:validate({
            ...props.game,genres:e.target.value
           },'genres')})
    }
    return (
        <div>

            {alert.redFlag&&<div className={updateStyle.redFlag}>
                You must fill in all the fields correctly
            </div>}
            {alert.greenFlag&&<div className={updateStyle.greenFlag}>
                An update has occurred in '{props.game.name}'
            </div>}
            { props.game && ( <div className={updateStyle.container}>
                <div className={updateStyle.alert} style={alert.name?{visibility:'visible'}:{visibility:'hidden'}}>...should have a name</div>
                    
                    <div>
                        <span>Name: </span>
                        <input className={updateStyle.input}
                            onChange={e=>handleChange(e)}
                            value={props.game.name}
                            name='name'
                            type="text"  placeholder='...nombre'/>
                    </div>
                    <div className={updateStyle.alert} style={alert.image?{visibility:'visible'}:{visibility:'hidden'}}>...should have a image</div>
                    <div>
                        <span>Image: </span>
                        <input className={updateStyle.input}
                            value={props.game.image}
                            name='image'
                            onChange={e=>handleChange(e)}
                            type="text"  placeholder='...imagen'>
                    </input>    
                    </div>
                    <div className={updateStyle.alert} style={alert.description!=='hidden'?{visibility:'visible'}:{visibility:'hidden'}}>{alert.description} </div>
                    <div className={updateStyle.description}>
                        <span className={updateStyle.tagDescription} >Description </span>   
                        <textarea className={updateStyle.textarea} name="description" id="" cols="30" value={props.game&&props.game.description&&props.game.description.replace(/<[^>]+>/g, '')} rows="10" placeholder='...descripción'
                           onChange={(e)=>handleChange(e)}
                            >
                        </textarea>
                    </div>
                    <span  className={updateStyle.inputPlatforms} >
                        <span>Plataforms: </span>
                        <button   onClick={()=>inputPlatforms(true)}>
                            +
                        </button>
                        <button   onClick={()=>inputPlatforms(false)}>
                            -
                        </button>
                    

                        {props.game&&props.game.platforms&&props.game.platforms.map((e,i)=>{
                            return(
                                <div key={i}>
                                     <select  
                                 name={`platforms-${i}`}
                                 id={i}
                                 data-name="name"
                                 value={e.name} 
                                 onChange={(e)=>handlePlatformsChange(e)}>
                                
                                    <option disabled value=""  >__Platforms
                                    </option>
                                    {[...props.platforms&&props.platforms.map((platforms,id)=>{
                                        return(<option key={id}
                                       
                                        
                                        >{platforms.name}
                                        </option>
                                        )
                                    })
                                    ,(<option key={props.platforms.length}
                                       
                                        
                                        >{e.name}
                                        </option>
                                        )]}
                                </select>
                                </div>
                            )   
                        })}
                        <span className={updateStyle.alert} style={alert.platforms?{visibility:'visible'}:{visibility:'hidden'}}>...Should have a platform</span>
                    </span>
                    <span className={updateStyle.inputGenres} >
                        <span>Generes: </span>
                        <button   onClick={()=>inputGenres(true)}>
                            +
                        </button>
                        <button   onClick={()=>inputGenres(false)}>
                            -
                        </button>
                    
                        {props.game&&props.game.genres&&props.game.genres.map((e,i)=>{
                            return(
                                <div key={i}>
                                    <select  
                                     name={`genres-${i}`}
                                     id={i}
                                     data-name="name"
                                     value={e.name} 
                                     onChange={(e)=>handleGenresChange(e)}>
                                    
                                        <option disabled value=""  >__Genres
                                        </option>
                                        {[...props.genres&&props.genres.map((genres,id)=>{
                                            return(<option key={id}
                                            >{genres.name}
                                            </option>
                                            )
                                        })
                                        ,(<option key={props.genres.length}
                                           
                                            
                                            >{e.name}
                                            </option>
                                            )]}
                                    </select>
                                </div>
                            )   
                        })}
                        <span className={updateStyle.alert} style={alert.genres?{visibility:'visible'}:{visibility:'hidden'}}>...should have a genre</span> 
                    </span>
                    <span className={updateStyle.submit} >
                        <div>
                            <button 
                                 className={updateStyle.button}
                                onClick={()=>handleUpdate()}
                                >
                                Update
                            </button>
                        </div>
                        <div>
                            <button 
                                className={updateStyle.button}
                                onClick={()=>handleCancel()}
                                >
                                Cancel
                            </button>
                        </div>
                    </span>
                </div>
            )}
        </div>
            )
    
}

export function mapStateToProps(state) {
    return {
      game: state.game,
      genres:state.genres,
      platforms:state.platforms
    };
  }
  
  export function mapDispatchToProps(dispatch) {
    return {
        updateDetails:(g)=>dispatch(updateDetails(g)),
        getGame:(g)=>dispatch(getGame(g)),
        getCache:()=>dispatch(getCacheGame()),
        updateGame:(g,id)=>dispatch(updateGame(g,id)),
        getGenres: (g)=>dispatch(getGenres(g)),
        getPlatforms: (p)=>dispatch(getPlatforms(p)),
        updateGenres:(arr)=>dispatch(updateGenres(arr)),
        updatePlatforms:(arr)=>dispatch(updatePlatforms(arr))
    };
  }
  export default connect(mapStateToProps,mapDispatchToProps)(Update)
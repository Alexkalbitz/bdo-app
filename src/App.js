import React, {useState} from 'react';
import cookrecipes from './data/cookrecipes.json';
import alchrecipes from './data/alchrecipes.json';
import alchbox from './data/alchbox.json';
import cookbox from './data/cookbox.json';
import RECIPES from './data/RECIPES.json';
import id_to_name from './data/item_id_to_name.json';
import price from './data/prices.json';
import items_in_groups from './data/items_in_groups.json';


export default class App extends React.Component {
    constructor() {
        super()
        this.state = {
            active: [],
            skill: 'Cooking',
            REC:RECIPES,
            recipes: cookrecipes.recipes,
            box: cookbox,
            search: "",
            price: price,
            id_to_name: id_to_name, 
            imperial_bonus: "250",
            sort_by_exp: false,
            sort_by_box: false,
            tax: 0.65,
            craft_multiplier_value: 2.5,
            showPopup: false,
            imperial_trades_max: 100,
            //alchrec: alchrecipes.recipes,
            //guildrec: guildrecipes.recipes
        }
        this.skillChange = this.skillChange.bind(this);
        this.recipeListCheckbox = this.recipeListCheckbox.bind(this);
        this.priceChange = this.priceChange.bind(this);
        this.closeRecipe = this.closeRecipe.bind(this);
        this.imperialBonus = this.imperialBonus.bind(this);
        this.taxChange = this.taxChange.bind(this);
        this.craftMultiplierChange = this.craftMultiplierChange.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.imperialTradesMax = this.imperialTradesMax.bind(this);
        this.uploadPrices = this.uploadPrices.bind(this)
    }

    uploadPrices(value){this.setState(prevstate => {
      try {
        const data = JSON.parse(value);
        return{price:data}
      }catch(e){
        return {price: 'no valid price data, try to paste again or reload the page to start with default values.'}
      }
      })
    };
      
    //value.length === 0 ? {}:{price:JSON.parse(value)})};

    imperialTradesMax(value) {this.setState({imperial_trades_max: value})};

    togglePopup() {this.setState({showPopup: !this.state.showPopup})};

    imperialBonus(value) {this.setState({imperial_bonus: 250 + parseFloat(value)})};

    craftMultiplierChange(value){this.setState({craft_multiplier_value: parseFloat(value)})};
    
    taxChange(){
        this.setState(prevState => {
            if(prevState.tax === 0.65){
                return {tax:0.845}
            }else{
                return {tax:0.65}
            }
        })
    }
    

    closeRecipe(target){
        this.setState(prevState => {
            const remove_idx = prevState.active.indexOf(target)
            prevState.active.splice(remove_idx, 1)
            return {active: prevState.active}
        })
    };

    priceChange(target) {
        //
        console.log('priceChange', target)
        this.setState(prevState => {
            const p = prevState.price
            console.log(p)
            p[target.name] = target.value
            return p
        })
    };

    skillChange() {
        //console.log('skillchange')
        this.setState(prevState => {
            if (prevState.skill === 'Cooking') {
                return {skill: "Alchemy", recipes: alchrecipes.recipes, active: [], box: alchbox}
            }
            return {skill: "Cooking", recipes: cookrecipes.recipes, active: [], box: cookbox} 
        })            
    }

    recipeListCheckbox(id) {
        //console.log('recipelist id:', id)
        //const acti = [] 
        this.setState(prevState => {
            if(prevState.active.includes(id)){
                let active = prevState.active.filter(ele => ele !== id)
                return{active:active}
            }else{
                prevState.active.push(id)
                return{active: prevState.active}
            } 
        })
    }

/*
############
############
############ -- Main Render
############
############
*/

    render() {
        /*
        Object.keys(RECIPES).forEach(function (prop) {
            var value = RECIPES[prop].result;
            console.log(value);
        });
        */

        //creating rec_list_by_box for sidebar 
        let rec_list_by_box = []
        if (this.state.sort_by_box === true) {
            const boxes = this.state.box
            const RRecipes = this.state.recipes
            Object.keys(boxes).forEach(prop => {
                const name = boxes[prop].name
                rec_list_by_box.push(<RecipeListBoxHeader name={name}/>)
                const item_ids = Object.keys(boxes[prop])
                let recipe;
                for (recipe of RRecipes){
                    //console.log(recipe)
                    let result;
                    for (result of recipe.result){
                        if (item_ids.includes(result)){
                            //console.log(recipe)
                            rec_list_by_box.push(<RecipeList recipeListCheckbox={this.recipeListCheckbox} 
                                header={false}
                                name={recipe.name} 
                                key={recipe.id} 
                                id={recipe.id}
                                exp={recipe.exp}
                                search={this.state.search}
                                active={this.state.active}
                                />)
                            }
                        }
                    }
                }      
            )
        }
        // regular rec list
        const rec_list = this.state.recipes.map(r => 
            <RecipeList recipeListCheckbox={this.recipeListCheckbox} 
            name={r.name} 
            key={r.id} 
            id={r.id}
            exp={r.exp}
            search={this.state.search}
            active={this.state.active}
            />)   
        this.state.sort_by_exp === false ? rec_list.sort(sort_alphbetical):rec_list.sort(sort_by_exp)
        
        // creating details for recipes to show up in css grid main
        let details = []
        if (this.state.active.length > 0){
            //console.log(box);
            details = this.state.active.map(id => {
                return (<RecipeDetail 
                    closeRecipe={this.closeRecipe}
                    priceChange={this.priceChange}
                    key={id}
                    object={this.state.REC[id]}
                    price={this.state.price}
                    id={id}
                    box={this.state.box}
                    id_to_name={this.state.id_to_name}
                    tax={this.state.tax}
                    imperial_bonus={this.state.imperial_bonus}
                    items_in_groups={items_in_groups}
                    imperial_trades_max={this.state.imperial_trades_max}
                    craft_multiplier_value={this.state.craft_multiplier_value}
                    />)
            })
        }
/*
############
############
############ -- Main Render return()
############
############
*/

        return (
            <div className="wrapper">
                <div className="skill">
                    <Skill skillChange={this.skillChange} key={'settings'} skill={this.state.skill}/>
                </div>
                <div className="settings">
                    <Settings 
                    uploadPrices={this.uploadPrices}
                    imperialTradesMax={this.imperialTradesMax}
                    imperial_trades_max={this.state.imperial_trades_max}
                    showPopup={this.state.showPopup}
                    togglePopup={this.togglePopup}
                    imperialBonus={this.imperialBonus} 
                    imperial_bonus={this.state.imperial_bonus} 
                    skill={this.state.skill}
                    taxChange={this.taxChange}
                    price={this.state.price}
                    craftMultiplierChange={this.craftMultiplierChange}
                    craft_multiplier_value={this.state.craft_multiplier_value}/>
                </div>
                <div className="sidebarheader">
                    <div className="reset">
                        Search: <input 
                        id="search"
                        type="text" 
                        name="search" 
                        size="10"
                        value={this.state.search}
                        onChange={(event) => this.setState({search:event.target.value})} 
                        /> &nbsp;
                        <input 
                        className="resetbutton"
                        value="reset" 
                        type="button" 
                        onClick={() => this.setState({search:""})}
                        />
                    </div>
                    <div className="checkboxitem" id='sort_by_box'>
                        <label className="checkboxitem_span">
                            Imperial Boxes
                        <input className="checkboxitem" 
                        onChange={() => this.setState({sort_by_box:!this.state.sort_by_box})}
                        type='checkbox' 
                        />
                        </label>
                    </div>
                    <div className="checkboxitem" id='sort_by_box'>
                        <label className="checkboxitem_span">
                            sort by XP
                        <input className="checkboxitem" 
                        onChange={() => this.setState({sort_by_exp:!this.state.sort_by_exp})}
                        type='checkbox' 
                        />
                        </label>
                    </div>
                    </div>
                    <span className="sidebar-span">
                    <div className="sidebar">
                    {this.state.sort_by_box === true? rec_list_by_box : rec_list}
                    </div>
                    </span>
                <div className="main"> 
                    {details}
                </div>
            </div>

        )
    }
}



function Settings(props) {
    return(
    <div>   
        <button className="popup-button" onClick={props.togglePopup}>Up / Download Prices</button>
                {props.showPopup ? <Popup 
                                    uploadPrices={props.uploadPrices}
                                    price={props.price} 
                                    closePopup={props.togglePopup}
                                    /> : null}
    <table>
        <tbody>
        <tr>
        <td>
        <label> Extra Profit for Box  </label>
            <input 
            type="number" 
            name="imperial_bonus"
            size="6"
            id="imperial_bonus"
            step='.1'
            onChange={event => props.imperialBonus(event.target.value)}
            /> 
        </td>
            <td>
                <label> Imperial trades / day </label>
                <input 
                    type="number" 
                    name="imperial_bonus"
                    size="6"
                    id="imperial_bonus"
                    value={props.imperial_trades_max}
                    onChange={event => props.imperialTradesMax(event.target.value)}
                    /> 
            </td>
        </tr>
        <tr>
            <td className="tax">
            <div className="checkboxitem" id={props.id}>
                <label className="checkboxitem_span">
                    Tax (check for Value Pack)
                <input className="checkboxitem" 
                onChange={() => props.taxChange()} 
                type='checkbox' 
                />
                </label>
            </div>    
            </td>
            <td>
        <label> result per craft </label>
            <input 
            type="number" 
            name="imperial_bonus"
            size="4"
            id="imperial_bonus"
            step='.1'
            value={props.craft_multiplier_value}
            onChange={event => props.craftMultiplierChange(event.target.value)}
            /> 
        </td>
        </tr>
        </tbody>
    </table>
    </div>
    )
};


function Skill(props) {
        return(
            <div className="skillChoice">
                <div className={props.skill !== "Cooking" ? "skillactive" : "skillpassive"} onClick={() => props.skillChange()} id="Alchemy">
                &nbsp;&nbsp;Alchemy&nbsp;&nbsp;
                </div>
                <div className={props.skill === "Cooking" ? "skillactive" : "skillpassive"} onClick={() => props.skillChange()} id="Cooking">
                &nbsp;&nbsp;Cooking&nbsp;&nbsp;
                </div>
            </div>
            )
}

function RecipeListBoxHeader(props){
    return (
        <div className='recipeboxheader'>
            <p> {props.name}</p>
           
        </div>
    )
}

function RecipeList(props) {
    const lname = props.name.toLowerCase()
    const lsearch =props.search.toLowerCase()
    //<span className="checkboxitem" style={props.search.length > 0 && lname.includes(lsearch) ? {backgroundColor:"white"}:{backgroundColor:""}}
    if (lname.includes(lsearch)){
        return (
            <div className="checkboxitem" id={props.id}>
                <label className="checkboxitem_span">
                <input className="checkboxitem" 
                onChange={() => props.recipeListCheckbox(props.id)} 
                type='checkbox' 
                checked={props.active.includes(props.id)}
                />
                {props.name} - {props.exp}xp
                </label>
            </div>           
        )}
    return ''
}

function RecipeDetail(props) {
    //some useStates 
    const [craftamount, setCraftAmount] = useState('1')
    //fixed variables
    //const link = "https://bdocodex.com/us/recipe/"
    //const picturelink = "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/0000"

    // variables for readability
    //console.log(props.object.box[0])
    const boxid = props.object.box.length === 0 ? "0" : props.object.box[0];
    const boxname = boxid === "0" ? "no box" : props.box[boxid].name;
    const ingredient_id = props.object.amounts.map(e => {return [e[0],e[2]]});
    const items_in_groups = props.items_in_groups
    const amount_for_daily_box_max = boxid !== "0" ? props.imperial_trades_max * props.box[boxid][props.object.result[0]] : null;
    const result_price = props.price[props.object.result[0]];
    const amount_per_box = boxid !== "0" ? props.box[boxid][props.object.result[0]] : null
    //const amount_for_box = {boxid === "0" ? props.box[boxid][props.object.result[0]]
    //console.log(check)
    //console.log(props.box[boxid][props.object.result[0]])
    // prices amounts and IDs for total cost/craft
    let total = 0;
    let is_complete = true;
    for (var item of ingredient_id){
        const amt = item[0]
        const id = item[1]
        if (isNaN(parseInt(props.price[id]))){
            is_complete = false;
        }else{
            total += parseInt(props.price[id])*amt;
       }       
    }
    // grab all results for header
    let result = []
    props.object.result.forEach(function (prop) {
        result.push(id_to_name[prop]);
    });


    const name_and_price_Input = props.object.result.map(r => 
        <PriceInputHeader
        price={props.price}
        priceChange={props.priceChange}
        name={id_to_name[r]} 
        id={r}
        key={"priceinput_"+r} 
        />)   

    //create ingredient list
    const ingredient_list = props.object.amounts.map(e => {
        let name = e[1]
        let amount = e[0]
        let id = e[2] 
        return (
            <IngredientList 
            craftamount={craftamount}
            name={name}
            id={id}
            amount={amount}
            priceChange={props.priceChange}
            price={props.price}
            items_in_groups={items_in_groups}
            />)
    })
    console.log(result_price)
    return(
        <div className="detail">
            <div className="recipeTitle">
            <input 
                    className="removerecipe"
                    value="X" 
                    type="button" 
                    onClick={() => props.closeRecipe(props.id)}
                    />
                <table>
                    <tbody>
                        <tr>
                            {name_and_price_Input}
                            <td>
                                <b>{props.object.exp}xp</b>
                            </td>
                            <td>             
                                <label> Craft Amount: </label><br></br>
                                <input 
                                type="number" 
                                name="craft_amounts"
                                size="9"
                                id="craft_amounts"
                                step='1'
                                value={craftamount}
                                onChange={event => setCraftAmount(event.target.value)}
                                /> 

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='recipeDetail'>
            <table>
                <tbody className="ingredientlist">
                        {ingredient_list}
                </tbody>
            </table>
        </div>
    <div className='recipeInfo'>
        <div className="recipeInfoImperialBox">
            {boxname !== 'no box' ? null : "no Imperial box"}
        </div>
        {boxname === 'no box' ? null : (
        <RecipeInfoBox
            name={boxname}
            price={props.box[boxid].price}
            amount={props.box[boxid][props.object.result[0]]}
            imperial_bonus={props.imperial_bonus / 100}
            amount_for_daily_box_max={amount_for_daily_box_max}
            craft_multiplier_value={props.craft_multiplier_value}
            id={boxid}
        />)}
        <hr></hr>
        <table>
            <tbody>
                <tr>
                    <td>
                    {boxid === "0" ? null : "Profit per Item as Box = "}
                    <span className={is_complete === false ? "silvercomplete":"silverincomplete"}> 
                    {boxid === "0" ? null : ((props.box[boxid].price / props.box[boxid][props.object.result[0]] * props.imperial_bonus / 100)-(total / props.craft_multiplier_value)).toFixed(0)}</span>
                    </td>
                    <td>
                    Cost total = 
                    <span className={is_complete === false ? "silvercomplete":"silverincomplete"}> {total * craftamount}</span>
                    </td>
                </tr>
                <tr>
                    <td>
                    MP value / item =&nbsp;
                    <span className={isNaN(result_price) ? "silvercomplete":"silverincomplete"}> {parseInt(result_price) * props.tax}</span>
                    </td>
                    <td>
                    Cost / item = 
                    <span className={is_complete === false ? "silvercomplete":"silverincomplete"}> {total / props.craft_multiplier_value}</span>
                    </td>
                </tr>
                <tr>
                <td>
                    MP value / total =&nbsp;
                    <span className={isNaN(result_price) ? "silvercomplete":"silverincomplete"}> {parseInt(result_price) * props.tax * craftamount}</span>
                    </td>
                    <td>
                    Cost / Craft = 
                    <span  className={is_complete === false ? "silvercomplete":"silverincomplete"}> {total}</span>
                    </td>
                </tr>
            </tbody>
        </table>
     </div>
</div>
    )
}



function IngredientList(props){
    const picturelink = "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/0000"
    const link_id = (props.id.length < 3 ?  props.items_in_groups[props.id][0] : props.id)
    console.log(link_id)
    return(
            <tr key={props.id}>
                <td>            
                    <img  src={picturelink + link_id + ".png"} alt="1" width="30" height="30"></img> 
                </td> 
                <td>
                    {props.amount * props.craftamount}x {props.name} &nbsp;
                </td> 
                <td> 
                <input 
                    style={typeof props.price[props.id] !== "undefined" ? {backgroundColor: 'white'}:{backgroundColor:'red'}}
                    type="number" 
                    name={props.id} 
                    size="6"
                    value={typeof props.price[props.id] !== "undefined" ? props.price[props.id]: ""}
                    placeholder="unset"
                    onChange={(event) => props.priceChange(event.target)}
                    step="50"
                    /> 
                </td> 
            </tr>
    )
}

function RecipeInfoBox(props){
    //console.log(props.price, props.imperial_bonus)
    //console.log(props)
    return(
    <div>
    <table>
        <tbody>      
            <tr>
                <td style={{whiteSpace:"nowrap"}}>
                    {props.name !== "no box" ? props.amount + "x  = " : ''}
                    {props.name !== "no box" ? <img  src={"https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/0000" + props.id + ".png"} alt="1" width="30" height="30"></img>: ''}
                </td>
                <td style={{width:"120px"}}>
                    {props.name}
                </td>
                <td>
                    total:<br></br> 
                    <b>
                    {props.name !== "no box" ?  (props.price * props.imperial_bonus).toFixed(0): ''}
                    </b>
                </td>
                <td>
                    per item:<br></br> 
                    <b>
                    {parseInt(props.price * props.imperial_bonus / props.amount)}
                    </b>
                </td>
            </tr>
        </tbody>
    </table>
    <table>
        <tbody>
            <tr>
                <td>
                daily amount = <b>{props.amount_for_daily_box_max} </b>
                </td>
                <td>
                daily crafts: <b>{parseInt(props.amount_for_daily_box_max / props.craft_multiplier_value)}</b>
                </td>
            </tr>
        </tbody>
    </table>
    </div>
    )
}


function PriceInputHeader(props){
    const picturelink = "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/0000"
    return (
        <span>
        <td>
            <img className="header" src={picturelink + props.id + ".png"} alt="1" width="40" height="40"></img>
        </td>
        <td>   
            <label> {props.name}  </label>
        </td>
        <td>  
            <input 
            style={typeof props.price[props.id] !== "undefined" ? {backgroundColor: 'white'}:{backgroundColor:'red'}}
            type="number" 
            name={props.id} 
            size="6"
            id={props.id}
            value={typeof props.price[props.id] !== "undefined" ? props.price[props.id]: ""}
            placeholder="unset"
            onChange={event => props.priceChange(event.target)}
            step="50"
            /> 
            &nbsp;&nbsp;&nbsp;
        </td>
        </span>
    )
};



function Popup (props){
    return (
      <div className='popup'>
        <div className='popup_inner'>
        <input className="removerecipe"
            value="X" 
            type="button" 
            onClick={props.closePopup}
            />            
          <h1> Copy the Text and save it locally or paste your Data here</h1>
            <p>
               <textarea id="dataupload" value={JSON.stringify(props.price)} onChange={event => props.uploadPrices(event.target.value)}></textarea>
            </p>
        </div>
      </div>
    );
  }



/*
######
######
###### -- Helper functions
######
######
*/


function sort_alphbetical(a, b) {
    const A = a.props.name;
    const B = b.props.name;

    let comparison = 0;
    if (A > B) {
      comparison = 1;
    } else if (A < B) {
      comparison = -1;
    }
    return comparison;
  };



  function sort_by_exp(a, b) {
    const A = parseInt(a.props.exp);
    const B = parseInt(b.props.exp);

    let comparison = 0;
    if (A > B) {
      comparison = -1;
    } else if (A < B) {
      comparison = 1;
    }
    return comparison;
  };





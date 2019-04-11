import React from 'react';
import Square from './Square';
let name1,name2,M,N;
const WIDTH=window.innerWidth;
const HEIGHT=window.innerHeight;
class Canvas extends React.Component {
  constructor(props){
  super(props);
  this.state={
      first_user:0,
      second_user:0
  };
  this.Init();
  this.Reset=this.Reset.bind(this);
  this.End=this.End.bind(this);};
    Reset = () => {
        this.setState({
            first_user: 0,
            second_user: 0
        });
        this.Init();
    };
    Init=()=>{
         name1=prompt('Введите имя первого игрока:', "Name1");
         name2 = prompt('Введите имя второго игрока:', "Name2");
        do{
            M = prompt('Введите число строк поля не больше 6:', "3");}
        while(M<=1 || M >6);
        do{
            N = prompt('Введите число столбцов поля не больше 6:', "3");}
        while(N<=1 || N >6);
    };
    End=()=>{
          if (this.state.first_user-this.state.second_user >0 ){alert("Победил игрок:"+name1)}
          else if (this.state.first_user-this.state.second_user <0){alert("Победил игрок:"+name2)}
          else {alert("Ничья")}
        return(<div style={{width:WIDTH,height:HEIGHT,paddingLeft:"35%",paddingTop:"20%"}}>
            Для продолжения нажмите -->
            <button onClick={this.Reset}>Эту кнопку:)</button></div>)};
  render()
    {return (
        this.state.first_user+this.state.second_user === (M-1)*(N-1)?
            this.End():
            <div className="svg_container" >
                <block>
                    <div  style={{width:220,float:"left",color:"red"}}>{name1}
                        <p>{this.state.first_user}</p></div>
                    <div  style={{width:220,float:"right",color:"blue"}}>{name2}
                        <p>{this.state.second_user}</p></div>
                </block>
                     <Square fn_add = {(flag,count)=>{
                        if (flag){
                            this.setState({
                                second_user:this.state.second_user+count
                            })
                        }else {
                            this.setState({
                                first_user:this.state.first_user+count
                            })
                        }
                     }} M={M} N={N} />
            </div>
    );
    }
}

export default Canvas;
import React from 'react'
const WIDTH=window.innerWidth;
const HEIGHT=window.innerHeight;
let arrTypeLine;
class Square extends React.Component{
    constructor(props){
        super(props);
        let arr = [];
        for (let i =0;i<this.props.N;i++){
            for(let j = 0;j<this.props.M;j++){
                arr.push(<circle cx={i*100}
                                 cy={j*100}
                                 r = {7}
                                 onMouseDown = {()=>this.clickDown(i,j)}
                                 onDragStart={(e)=>e.preventDefault()}/>)
            }
        }
        arrTypeLine = [];
        for(let i=0;i<this.props.N-1;i++){
            for(let j=0;j<this.props.M-1;j++){
               arrTypeLine.push(
                   {
                       left:{
                           x1:(i*this.props.N+j),
                           x2:(i*this.props.N+j+1),
                           active:false
                       },
                       right:{
                           x1:((i+1)*this.props.N+j),
                           x2:((i+1)*this.props.N+(j+1)),
                           active:false

                       },
                       top:{
                           x1:(i*this.props.N+j),
                           x2:((i+1)*this.props.N+j),
                           active:false
                       },
                       bottom:{
                           x1:(i*this.props.N+(j+1)),
                           x2:((i+1)*this.props.N+(j+1)),
                           active:false
                       },
                       not_used:true
                   });

            }
        }
        this.state={
            flagColor:false,
            elements:arr
        };
        this.clickDown=this.clickDown.bind(this);
        this.clickUp=this.clickUp.bind(this);
        this.clickAll=this.clickAll.bind(this);
        this.getLine=this.getLine.bind(this);
    };

    clickAll=()=>{
        let arrNew = this.state.elements;
        for (let i =0;i<this.props.N;i++){
            for(let j = 0;j<this.props.M;j++){
                arrNew[i*this.props.M+j]=(<circle cx={i*100}
                                                  cy={j*100}
                                                   r = {7}
                                 onMouseDown = {()=>this.clickDown(i,j)}
                                 onDragStart={(e)=>e.preventDefault()}/>)
            }
        }
        this.setState({
            elements:arrNew
        })};
    clickDown=(i,j)=>{
        let arrNew=this.state.elements;
        let coord = [[i-1,j],[i+1,j],[i,j+1],[i,j-1]];
        coord.forEach((item)=>{
            if (item[0]>=0&&item[1]>=0&&item[0]<this.props.N && item[1]<this.props.M){
                arrNew[item[0]*this.props.M+item[1]] = <circle cx = {item[0]*100}
                                                               cy = {item[1]*100}
                                                               r={10}
                                                               onMouseUp={()=>this.clickUp(i,j,item[0],item[1],coord)}
                                                               onDragStart={(e)=>e.preventDefault()}
                />
            }
        });
        this.setState({
            elements:arrNew
        })
    };
    getLine=(x1,x2,y1,y2)=>{
        return(
            <line x1={x1}
              x2={x2}
              y1={y1}
              y2={y2}
              strokeLinecap={"round"}
              stroke= {this.state.flagColor ? "blue":"red"}
              strokeWidth={5}/>)
    };
    clickUp=(i,j,ni,nj,coord)=>{
        let arrNew=this.state.elements;
        let lastFlag = this.state.flagColor;
        coord.forEach((item)=>{
            if (item[0]>=0&&item[1]>=0&&item[0]<this.props.N && item[1]<this.props.M){
                arrNew[item[0]*this.props.M+item[1]] = <circle cx = {item[0]*100}
                                       cy = {item[1]*100}
                                       r={7}
                                       onMouseDown = {()=>this.clickDown(item[0],item[1])}
                                       onDragStart={(e)=>e.preventDefault()}
                />
            }});
        let x1=i*this.props.N+j,x2=ni*this.props.N+nj,count=0;
        if (x1>x2){
            [x1,x2]=[x2,x1];
        }
        for(let i=0;i<arrTypeLine.length;i++){
            let item=arrTypeLine[i];
            if(item.top.x1 === x1 && item.top.x2 === x2){
                if(item.top.active){
                    return
                }
                item.top.active=true
            }
            else if(item.bottom.x1 === x1 && item.bottom.x2 === x2){
                if(item.bottom.active){
                    return
                }
                item.bottom.active=true
            }
            else if(item.left.x1 === x1 && item.left.x2 === x2){
                if(item.left.active){
                    return
                }
                item.left.active=true
            }
            else if(item.right.x1 === x1 && item.right.x2 === x2){
                if(item.right.active){
                    return
                }
                item.right.active=true
            }
            if(item.not_used && item.top.active && item.bottom.active && item.left.active && item.right.active){
               let y=item.top.x1 % this.props.N;
               let x=(item.top.x1 - y)/this.props.N;
                arrNew.push(<rect
                    fill = {this.state.flagColor ? "blue":"red"}
                    fillOpacity={.3}
                    x={x*100}
                    y={y*100}
                    width={98}
                    height={98}/>);
                count++;
                lastFlag = !this.state.flagColor;
                item.not_used=false;
            }

        }
        if(count !== 0){
            this.props.fn_add(this.state.flagColor,count);}
        (nj === j && i < ni) ? arrNew.push(this.getLine(ni*100-8,i*100+8,nj*100,j*100)):
            (nj === j && i > ni) ? arrNew.push(this.getLine(ni*100+8,i*100-8,nj*100,j*100)):
                (ni === i && j < nj) ? arrNew.push(this.getLine(ni*100,i*100,nj*100-8,j*100+8)):
                    arrNew.push(this.getLine(ni*100,i*100,nj*100+8,j*100-8));
        this.setState(
            {
                flagColor:!lastFlag,
                elements:arrNew
            });
    };
    render(){
        return(
            <svg id="aliens-go-home-canvas"
                 preserveAspectRatio="xMaxYMax meet"
                 viewBox={[WIDTH/-5, 600-HEIGHT, WIDTH, HEIGHT]}
                 onMouseUp={this.clickAll}>
                {this.state.elements}
            </svg>

        )
    }
}
export default Square;
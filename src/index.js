import { toBeInTheDocument } from '@testing-library/jest-dom/dist/matchers';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//     // constructor(props){
//     //     super(props);
//     //     this.state = {
//     //         value: null
//     //     };
//     // }
//     render() {
//       return (
//         <button className="square" onClick={()=>this.props.onClick()}>
//           {this.props.value}
//         </button>
//       );
//     }
//   }
  
function  Square(props){
    return (
        <button className={props.color?'win-grid':'square'} onClick={props.onClick}>
            {props.value}
        </button>
    ) 
}
  class Board extends React.Component {
    // constructor(props){
    //     super(props);
    //     this.state = {
    //         xIsNext: true,
    //         squares: Array(9).fill(null)
    //     };
    // }
    // handleClick = (i)=>{
    //     // this.setState()
    //     // console.log(i , ':x');
    //     // 有人获胜或者选的格子已经被填了
    //     const square = this.state.squares.slice();
    //     if(calculateWinner(square) || square[i]){
    //         return;
    //     }
    //     if(this.state.xIsNext){
    //         square[i] = 'X';
    //     }else{
    //         square[i] = 'O';
    //     }
    //     this.setState({squares:square, xIsNext:!this.state.xIsNext});
    // }
    renderSquare(i) {
        let color = false;
        if(this.props.where){
            for(let j=0; j<this.props.where.length; j++){
                if(this.props.where[j] === i){
                    color=true;
                }
            }
        }
      return (
        <Square 
            color={color}
            key={i}
            value={this.props.squares[i]}
            onClick={()=>this.props.onClick(i)}    
        />
      );
    }
  
    render() {
    //   const status = `Next player: ${this.state.xIsNext?'X':'O'}`;
        // const winner = calculateWinner(this.state.squares);
        // let status;
        // if(winner){
        //     status = 'Winner:'+winner;
        // }else{
        //     status = `Next player: ${this.state.xIsNext?'X':'O'}`;
        // }
        const rows = [1,2,3];
        const columns = [1,2,3];
      return (
        <div>
          <div className="status">{this.props.status}</div>
          {
              rows.map((v1,k1)=>{
                  return (
                      <div key={v1} className='board-row'>
                          {
                              columns.map((v2, k2)=>{
                                  return (
                                      this.renderSquare((v1-1)*3+v2-1)
                                  )
                              })
                          }
                      </div> 
                  )
              })
          }
          {/* <div className="board-row">
            {this.renderSquare(0)}  
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div> */}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
      constructor(props){
          super(props);
          this.state = {
              history:[
                  {
                      squares: Array(9).fill(null),
                      at:null,
                      isX:null,
                      id:0
                  }
              ],
              xIsNext: true,
              stepNumber:0
          }
      }
      handleClick(i){
          const statehistory = this.state.history.slice();
          let history = [];
          let current = null;
          for(let i=0; i<statehistory.length; i++){
              if(statehistory[i].id<=this.state.stepNumber){
                  if(statehistory[i].id===this.state.stepNumber){
                      current = statehistory[i];
                  }
                  history.push(statehistory[i]);
              }
          }
          const squares = current.squares.slice();
        //   判断是否被填过或是否已经出现胜者
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        // 更新格内的符号
        squares[i] = this.state.xIsNext?'X':'O';
        this.setState({
            xIsNext:!this.state.xIsNext,
            // 补充历史记录
            history: history.concat([{
                squares:squares,
                at:i,
                isX: this.state.xIsNext?'X':'O',
                id: history.length
                
            }]),
            stepNumber: history.length

        })
      }

      jumpTo(step){
        //   还要更新 xIsNext
        this.setState({
            stepNumber:step,
            xIsNext: step%2===0
        })
      }

      ascend = true;
      sortHistory = ()=>{
          let history = this.state.history.slice();
        //   console.log(this.state);
            if(this.ascend){
                for(let i=0; i<history.length; i++){
                    let hi = history[i];
                    let j;
                    for(j=i; j>0&&hi.id>history[j-1].id; j--){
                        history[j] = history[j-1];
                    }
                    history[j] = hi;
                }
            }else{
                for(let i=0; i<history.length; i++){
                    let hi = history[i];
                    let j;
                    for(j=i; j>0&&hi.id<history[j-1].id; j--){
                        history[j] = history[j-1];
                    }
                    history[j] = hi;
                }
            }
            this.ascend = !this.ascend;
            this.setState({
                history,

            });
      }
    render() {
        const history = this.state.history.slice();
        let current;
        for(let i=0; i<history.length; i++){
            if(this.state.stepNumber===history[i].id){
                current = history[i];
            }
        }
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move)=>{
            const desc = step.id?
                'Go to move #' + step.id + `; draw ${step.isX?'X':'O'} at:(${parseInt(step.at/3)+1}, ${step.at%3+1})`:
                'Go to game start';
            return (
                <li key={step.id}>
                    <button className={step.id===this.state.stepNumber?'history-text':''} onClick={()=>this.jumpTo(step.id)}>{desc}</button>
                </li>
            )
        })


        let status;
        if(winner){
            if(winner.whowin==='tie'){
                status = 'Tie: No Winner.';
            }else{
                status = 'Winner:'+winner.whowin;
            }
        }else{
            status = `Next player: ${this.state.xIsNext?'X':'O'}`;
        }
      return (
        <div className="game">
            <div className="game-board">
                <Board where={winner?.where} squares={current.squares} status={status} onClick={(i)=>this.handleClick(i)}/>
            </div>
            <div className="game-info">
                <div>{status}</div>
                <div className='col-layout'>
                    <button onClick={this.sortHistory}>sort</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        </div>
      );
    }
  }
  
  // ========================================
  function calculateWinner(squares){
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return {
              whowin: squares[a],
              where: lines[i].slice()
          }
        }
      }
      for(let i=0; i<squares.length; i++){
          if(!squares[i]){
            // return null;
            return null;
          }
      }
      return {
          whowin:'tie'
      };
  }

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
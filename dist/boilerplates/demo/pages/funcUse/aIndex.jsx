import React from 'react';
import { connect } from 'dva';
import './style.less';

function Index({index: { test }}) {
    const handleClick = () => {
        this.props.dispatch({
            type: 'index/updateReducer',
            payload: {
                test: test + 1
            }
        })
    }
    return (
        <div className="container">
            <h2 className="title">welcome to lambor.js</h2>
            <div>No. {test} </div>
            <button onClick={handleClick}>增加</button>
            <div>代码:</div>
            <pre>
                {`
                    function Index({index: { test }}) {
                        const handleClick = () => {
                            this.props.dispatch({
                                type: 'index/updateReducer',
                                payload: {
                                    test: test + 1
                                }
                            })
                        }
                        return (
                            <div className="container">
                                <h2 className="title">welcome to lambor.js</h2>
                                <div>No. {test} </div>
                                <button onClick={handleClick}>增加</button>
                            </div>
                        )
                    }
                    Index.fetching = ({dispatch}) => {
                        return [
                            dispatch({
                                type: 'index/updateReducer',
                                payload: {
                                    test: 10
                                }
                            })
                        ]
                    }
                `}
            </pre>
        </div>
    )
}
Index.fetching = ({dispatch}) => {
    return [
        dispatch({
            type: 'index/updateReducer',
            payload: {
                test: 10
            }
        })
    ]
}

export default connect((state) => ({
    index: state.index
}))(Index)

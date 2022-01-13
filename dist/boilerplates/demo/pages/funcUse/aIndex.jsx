import React from 'react';
import { connect } from 'dva';
import logo from '@/assets/logo.png';
import './style.less';


function Index({index: { test }, dispatch}) {
    const handleClick = () => {
        dispatch({
            type: 'index/updateReducer',
            payload: {
                test: test + 1
            }
        })
    }
    return (
        <div className="container">
            <img className="logo" src={logo} />
            <h2 className="title">welcome to lambor.js</h2>

            <div className="tip">
                we will set click count is 10 in the server side current
                <div className="count">Click Count: {test}</div> 
            </div>
            <button className="add-button" onClick={handleClick}>add count</button>
            <div className="code">
                <pre>
                    {`
                    import React from 'react';
                    import { connect } from 'dva';
                    import logo from '@/assets/logo.png';
                    import './style.less';
                    function Index({index: { test }, dispatch}) {
                        const handleClick = () => {
                            dispatch({
                                type: 'index/updateReducer',
                                payload: {
                                    test: test + 1
                                }
                            })
                        }
                        return (
                            <div className="container">
                                <img className="logo" src={logo} />
                                <h2 className="title">welcome to lambor.js</h2>
                    
                                <div className="tip">
                                    we will set click count is 10 in the server side current
                                    <div className="count">Click Count: {test}</div> 
                                </div>
                                <button className="add-button" onClick={handleClick}>add count</button>
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

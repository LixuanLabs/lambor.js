import * as React from 'react';
import { connect } from 'dva';
import logo from '@/assets/logo.png';
import './style.less';

class Index extends React.Component {
    static fetching({dispatch}) {
        return [
            dispatch({
                type: 'index/updateReducer',
                payload: {
                    test: 10
                }
            })
        ]
    }
    handleClick = () => {
        const { index: {test} } = this.props
        this.props.dispatch({
            type: 'index/updateReducer',
            payload: {
                test: test + 1
            }
        })
    }
    render() {
        const { index } = this.props;
        return (
            <div className="container">
                <img className="logo" src={logo} />
                <h2 className="title">welcome to lambor.js</h2>

                <div className="tip">
                    we will set click count is 10 in the server side current
                    <div className="count">Click Count: {index.test}</div> 
                </div>
                <button className="add-button" onClick={this.handleClick}>增加</button>
                <div className="code">
                    <pre>
                        {`
                            class Index extends React.Component {
                                static fetching({dispatch}) {
                                    return [
                                        dispatch({
                                            type: 'index/updateReducer',
                                            payload: {
                                                test: 10
                                            }
                                        })
                                    ]
                                }
                                handleClick = () => {
                                    const { index: {test} } = this.props
                                    this.props.dispatch({
                                        type: 'index/updateReducer',
                                        payload: {
                                            test: test + 1
                                        }
                                    })
                                }
                                render() {
                                    const { index } = this.props;
                                    return (
                                        <div className="container">
                                            <h2 className="title">welcome to lambor.js</h2>
                                            <div>No. {index.test} </div>
                                            <button onClick={this.handleClick}>增加</button>
                                        </div>
                                    )
                                }
                            }
                        `}
                    </pre>
                </div>
            </div>
        )
    }
}

export default connect((state) => ({
    index: state.index
}))(Index)

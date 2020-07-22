import * as React from 'react';
import { connect } from 'dva';
import './style.less';


class Index extends React.Component {
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
                <h2 className="title">welcome to xrd.js</h2>
                <div>No. {index.test} </div>
                <button onClick={this.handleClick}>增加</button>
            </div>
        )
    }
}

export default connect((state) => ({
    index: state.index
}))(Index)
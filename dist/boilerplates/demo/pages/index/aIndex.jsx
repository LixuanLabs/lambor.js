import * as React from 'react';
import { connect } from 'dva';
import './style.less';


class Index extends React.Component {
    handleClick = () => {
        console.log('click')
        this.props.dispatch({
            type: 'index/updateReducer',
            payload: {
                test: 2
            }
        })
    }
    render() {
        const { index } = this.props;
        return (
            <div className="container">
                <div>{index.test} + 7</div>
                <button onClick={this.handleClick}>点击</button>
            </div>
        )
    }
}

export default connect((state) => ({
    index: state.index
}))(Index)
import React from 'react';
import PropTypes from 'prop-types';

export class InputText extends React.Component {
  constructor(props) {
    super(props);

    this.handleTextInput = this.handleTextInput.bind(this);
  }
  
  handleTextInput(e) {
    const textInput = e.target.value;
    this.props.onChange(textInput);
  }
  
  render() {
    return (
        <input type="text" 
          value={this.props.value} //controlled component
          onChange={this.handleTextInput} />
    );
  }
}

InputText.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}
import React from 'react';
import PropTypes from 'prop-types';

export class InputText extends React.Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  
  handleTextChange(e) {
    const textInput = e.target.value;
    this.props.onChange(textInput);
  }

  handleKeyPress(e){
    if(e.key === 'Enter'){
      this.props.onSubmit();
    }
 }

  
  render() {
    return (
        <input type="text" 
          value={this.props.value} //controlled component
          onChange={this.handleTextChange}
          onKeyPress={this.handleKeyPress}
        />
    );
  }
}

InputText.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}
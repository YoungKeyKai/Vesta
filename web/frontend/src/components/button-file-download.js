import { Component } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

export default class ButtonFileDownload extends Component {
  state = {
    link : null
  };

  componentDidMount() {
    this.updateLink();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userUploadId !== this.props.userUploadId ||
          prevState.link !== this.state.link) {
      this.updateLink();
    }
  }

  updateLink() {
    console.log("Updating link");
    axios.get(`/api/useruploads/${this.props.userUploadId}`)
      .then((res) => {
        const data = res.data;
        this.setState({
          link : data.content
        })
        console.log("new link = " + this.state.link); 
      })
      .catch((err) => console.log(err));
    
  }
  
  render() {
    return <Button href={this.state.link} {...this.props}>{this.props.text}</Button>
  }
}
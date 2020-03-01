import React, { Component } from "react";
import { ScrollView, Text, Animated } from "react-native";
import { Tile, Header, Card, Button, Icon, View } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import Loading from "./LoadingComponent";

const mapStateToProps = state => {
  return {
    campsites: state.campsites,
    promotions: state.promotions,
    partners: state.partners
  };
};

function RenderItem(props) {
  const { item } = props;

  if (props.isLoading) {
    return <Loading />;
  }
  if (props.errMess) {
    return (
      <View>
        <Text>{props.errMess}</Text>
      </View>
    );
  }

  if (item) {
    return (
      <Tile title={item.name} imageSrc={{ uri: baseUrl + item.image }} >
        <Text style={{ margin: 10, color: "red" ,  backgroundColor:"#86927B" , borderColor:"black" }} > {item.price}</Text>
        
      </Tile>
    );
  }
  // return <View />;
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleValue: new Animated.Value(0)
    };
  }

  animate() {
    Animated.timing(this.state.scaleValue, {
      toValue: 1,
      duration: 1500
    }).start();
  }

  componentDidMount() {
    this.animate();
  }
  static navigationOptions = {
    title: "Home"
  };

  render() {
    return (
      <ScrollView>
        <Header
          backgroundImage={require("../components/images/header.jpg")}
          containerStyle={{
            backgroundColor: "#31AD96",
            justifyContent: "space-around"
          }}
        />
        <RenderItem
          item={
            this.props.campsites.campsites.filter(
              campsite => campsite.featured
            )[0]
          }
          isLoading={this.props.campsites.isLoading}
          errMess={this.props.campsites.errMess}
        />
        <RenderItem
          item={
            this.props.promotions.promotions.filter(
              promotion => promotion.featured
            )[0]
          }
          isLoading={this.props.promotions.isLoading}
          errMess={this.props.promotions.errMess}
        />
        <RenderItem
          item={
            this.props.partners.partners.filter(partner => partner.featured)[0]
          }
          isLoading={this.props.partners.isLoading}
          errMess={this.props.partners.errMess}
        />

        <Card
          style={{ margin: 0, padding: 0 }}
          title="Connect With Us"
          containerStyle={{
            backgroundColor: "#DD7848",
            justifyContent: "space-around"
          }}
        >
          <Text style={{ marginBottom: 10, color: "white" }}>Help</Text>
          <Text style={{ marginBottom: 10, color: "white" }}>Stores</Text>
          <Text style={{ marginBottom: 10, color: "white" }}>App</Text>
          <Text style={{ marginBottom: 10, color: "white" }}>Social</Text>
          <Button title="Contact Us" type="outline" raised="true" />
        </Card>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps)(Home);

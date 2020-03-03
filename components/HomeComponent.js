import React, { Component } from "react";
import { ScrollView, Text, Animated, StyleSheet, View } from "react-native";
import {
  Tile,
  Header,
  Card,
  Button,
  Icon,
  Rating
} from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import Loading from "./LoadingComponent";
import MyComponent from "./FooterComponent";

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
      <Tile title={item.name} imageSrc={{ uri: baseUrl + item.image }}>
        <View style={{ width: 150 }}>
          <Rating
            startingValue={item.rating}
            imageSize={20}
            style={{ alignItems: "flex-left" }}
            style={{
              paddingVertical: 10,
              backgroundColor: "white",
              borderColor: "#413F41",
              borderWidth: 1
            }}
            readonly
          />

          <Button
            buttonStyle={{
              backgroundColor: "#86927B",
              padding: 5,
              borderWidth: 1,
              borderColor: "#413F41"
            }}
            title={item.price}
            type="solid"
            raised="true"
          />
        </View>
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
        <Header
          backgroundImage={require("../components/images/banner1.jpg")}
          containerStyle={{
            backgroundColor: "#31AD96",
            justifyContent: "space-around",
            paddingBottom: 0
          }}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default connect(mapStateToProps)(Home);

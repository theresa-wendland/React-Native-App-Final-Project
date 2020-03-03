import React, { Component } from "react";
import { View, FlatList } from "react-native";
import { Tile, Card, Text, Button, Icon } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import Loading from "./LoadingComponent";
import * as Animatable from "react-native-animatable";

const mapStateToProps = state => {
  return {
    campsites: state.campsites
  };
};

class Directory extends Component {
  static navigationOptions = {
    title: "Products"
  };

  render() {
    const { navigate } = this.props.navigation;
    const renderDirectoryItem = ({ item }) => {
      return (
        <Animatable.View animation="fadeInRightBig" duration={2000}>
          <Card
            title={item.name}
            titleNumberOfLines={2}
            featured
            onPress={() => navigate("CampsiteInfo", { campsiteId: item.id })}
            image={{ uri: baseUrl + item.image }}
            
          >
            <Text style={{ marginBottom: 10 }}>{item.description}</Text>
            <Button
              buttonStyle={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0,
                backgroundColor: "#86927B"
              }}
              title="View Item"
              onPress={() => navigate("CampsiteInfo", { campsiteId: item.id })}
            />
          </Card>
        </Animatable.View>
      );
    };

    if (this.props.campsites.isLoading) {
      return <Loading />;
    }
    if (this.props.campsites.errMess) {
      return (
        <View>
          <Text>{this.props.campsites.errMess}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={this.props.campsites.campsites}
        renderItem={renderDirectoryItem}
        keyExtractor={item => item.id.toString()}
      />
    );
  }
}

export default connect(mapStateToProps)(Directory);

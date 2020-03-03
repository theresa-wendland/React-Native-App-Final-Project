import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Modal,
  Button,
  StyleSheet,
  Alert,
  PanResponder,
  Share,
  Divider,
  Avatar
} from "react-native";
import {
  Card,
  Icon,
  Rating,
  Input,
  Image,
  PricingCard,
  ButtonGroup
} from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postFavorite, postComment } from "../redux/ActionCreators";
import * as Animatable from "react-native-animatable";

const mapStateToProps = state => {
  return {
    campsites: state.campsites,
    comments: state.comments,
    favorites: state.favorites
  };
};

const mapDispatchToProps = {
  postFavorite: campsiteId => postFavorite(campsiteId),
  postComment: (campsiteId, rating, author, text) =>
    postComment(campsiteId, rating, author, text)
};

function RenderCampsite(props) {
  const { campsite } = props;

  const view = React.createRef();

  const recognizeDrag = ({ dx }) => (dx < -200 ? true : false);

  const recognizeComment = ({ dx }) => (dx < 200 ? true : false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      view.current
        .rubberBand(1000)
        .then(endState =>
          console.log(endState.finished ? "finished" : "canceled")
        );
    },
    onPanResponderEnd: (e, gestureState) => {
      console.log("pan responder end", gestureState);
      if (recognizeDrag(gestureState)) {
        Alert.alert(
          "Add Favorite",
          "Are you sure you wish to add " + campsite.name + " to favorites?",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => console.log("Cancel Pressed")
            },
            {
              text: "OK",
              onPress: () =>
                props.favorite
                  ? console.log("Already set as a favorite")
                  : props.markFavorite()
            }
          ],
          { cancelable: false }
        );
      } else if (recognizeComment(gestureState)) {
        props.onShowModal();
      }
      return true;
    }
  });

  const shareCampsite = (title, message, url) => {
    Share.share(
      {
        title: title,
        message: `${title}: ${message} ${url}`,
        url: url
      },
      {
        dialogTitle: "Share " + title
      }
    );
  };

  if (campsite) {
    return (
      <Animatable.View
        animation="fadeInDown"
        duration={2000}
        delay={1000}
        ref={view}
        {...panResponder.panHandlers}
      >
        <Card title={campsite.name} image={{ uri: baseUrl + campsite.image }}>
          <Text style={{ margin: 10 }}>{campsite.description}</Text>
          <View style={styles.cardRow}>
            <Icon
              name="cart-plus"
              type="font-awesome"
              color="#413F41"
              raised
              reverse
            />
            <Icon
              name={props.favorite ? "heart" : "heart-o"}
              type="font-awesome"
              color="#413F41"
              raised
              reverse
              onPress={() =>
                props.favorite
                  ? console.log("Already set as a favorite")
                  : props.markFavorite()
              }
            />

            <Icon
              name={"share"}
              type="font-awesome"
              color="#413F41"
              style={styles.cardItem}
              raised
              reverse
              onPress={() =>
                shareCampsite(
                  campsite.name,
                  campsite.description,
                  baseUrl + campsite.image
                )
              }
            />
          </View>
        </Card>
      </Animatable.View>
    );
  }
  return <View />;
}

function RenderComments({ comments }) {
  const renderCommentItem = ({ item }) => {
    return (
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.text}</Text>
        <Rating
          startingValue={item.rating}
          imageSize={10}
          style={{ alignItems: "flex-start" }}
          style={{ paddingVertical: 10 }}
          readonly
        />
        <Text
          style={{ fontSize: 12 }}
        >{`-- ${item.author}, ${item.date}`}</Text>
      </View>
    );
  };

  return (
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <Card title="Comments">
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={item => item.id.toString()}
        />
      </Card>
    </Animatable.View>
  );
}

class CampsiteInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      rating: 5,
      author: "",
      text: ""
    };
  }
  markFavorite(campsiteId) {
    this.props.postFavorite(campsiteId);
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  handleComment(campsiteId) {
    console.log(JSON.stringify(this.state));
    this.props.postComment(
      campsiteId,
      this.state.rating,
      this.state.author,
      this.state.text
    );
    this.toggleModal();
  }

  resetForm() {
    this.setState({
      rating: 5,
      author: "",
      text: "",
      showModal: false
    });
  }

  static navigationOptions = {
    title: "Product Details "
  };

  render() {
    const campsiteId = this.props.navigation.getParam("campsiteId");
    const campsite = this.props.campsites.campsites.filter(
      campsite => campsite.id === campsiteId
    )[0];
    const comments = this.props.comments.comments.filter(
      comment => comment.campsiteId === campsiteId
    );
    const buttons = ["Item:Cream", "Price:$5.00", "Quantity:1"];
    return (
      <ScrollView>
        <RenderCampsite
          campsite={campsite}
          favorite={this.props.favorites.includes(campsiteId)}
          markFavorite={() => this.markFavorite(campsiteId)}
          onShowModal={() => this.toggleModal()}
        />
        <RenderComments comments={comments} />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
            <Card
              title="Shopping Cart"
              image={{ uri: baseUrl + campsite.image }}
            >
              <ButtonGroup
                buttons={buttons}
                textStyle={{color:"white",fontWeight:"bold"}}
                containerStyle={{ height: 50, backgroundColor: "#86927B" }}
              />
              <View style={{ margin: 10 }}>
                <Button
                  title="View Cart"
                  color="#413F41"
                  onPress={() => {
                    this.handleComment(campsiteId);
                    this.resetForm();
                  }}
                />
              </View>

              <View style={{ margin: 10 }}>
                <Button
                  onPress={() => {
                    this.toggleModal();
                    this.resetForm();
                  }}
                  color="#86927B"
                  title="Continue Shopping"
                />
              </View>
            </Card>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    margin: 20
  },

  cardItem: {
    flex: 1,
    margin: 10
  },
  cardRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);

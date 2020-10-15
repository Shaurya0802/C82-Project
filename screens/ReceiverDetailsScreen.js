import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Card, Header, Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';

export default class ReceiverDetailsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: firebase.auth().currentUser.email,
            receiverId: this.props.navigation.getParam('details')['user_id'],
            requestId: this.props.navigation.getParam('details')['request_id'],
            thingName: this.props.navigation.getParam('details')['thing_name'],
            reasonForRequesting: this.props.navigation.getParam('details')['reason_to_request'],
            requestId: this.props.navigation.getParam('details')['request_id'],
            receiverName: '',
            receiverContact: '',
            receiverAddress: '',
            receiverRequestDocId: ''
        }
    }

    getReceiverDetails = () => {
        db.collection('users').where('email_id', '==', this.state.receiverId).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                this.setState({
                    receiverName: doc.data().first_name,
                    receiverContact: doc.data.contact,
                    receiverAddress: doc.data().address
                });
            });
        });

        db.collection('requested_things').where('request_id', '==', this.state.requestId).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                this.setState({
                    receiverRequestDocId: doc.id
                });
            });
        });
    }

    updateThingStatus = () => {
        db.collection('all_donations').add({
            thing_name: this.state.thingName,
            request_id: this.state.requestId,
            requested_by: this.state.receiverName,
            donor_id: this.state.userId,
            request_status: 'Donor Interested'
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 0.1}}>
                    <Card title={`Requested Thing's information`}>
                        <Card>
                            <Text style={{fontWeight: 'bold'}}>
                                Name: {this.state.thingName}
                            </Text>
                        </Card>

                        <Card>
                            <Text style={{fontWeight: 'bold'}}>
                                Reason to request: {this.state.reasonForRequesting}
                            </Text>
                        </Card>
                    </Card>
                </View>

                <View style={{flex: 0.3, marginTop: 75}}>
                    <Card title = {'Receiver Information'} titleStyle = {{fontSize: 20}}> 
                        <Card>
                            <Text style={{fontWeight: 'bold'}}>
                                Name: {this.state.receiverName}
                            </Text>
                        </Card>

                        <Card>
                            <Text style={{fontWeight: 'bold'}}>
                                Contact: {this.state.receiverContact}
                            </Text>
                        </Card>

                        <Card>
                            <Text style={{fontWeight: 'bold'}}>
                                Address: {this.state.receiverAddress}
                            </Text>
                        </Card>
                    </Card>
                </View>

                <View style={styles.buttonContainer}>
                    {this.state.receiverId !== this.state.userId ? (
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={() => {
                                this.updateThingStatus();
                                this.props.navigation.navigate('MyDonations');
                            }}
                        >
                            <Text>Donate</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
    },
    buttonContainer : {
      flex:0.3,
      justifyContent:'center',
      alignItems:'center'
    },
    button:{
      width:200,
      height:50,
      justifyContent:'center',
      alignItems : 'center',
      borderRadius: 10,
      backgroundColor: 'orange',
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       },
      elevation : 16,
      marginTop: 100
    }
});
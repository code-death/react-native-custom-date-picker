import React, {useState} from 'react';
import {View, Text, Button, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import dayjs from 'dayjs';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';

let primaryColor = '#6600ff';

const TimePicker = ({onTimeCancel, onTimeConfirm, defaultDate, accentColor, hourStep, minStep, minHour, maxHour}) => {
    const [currentTime, setCurrentTime] = useState(defaultDate ? defaultDate : dayjs());


    if(accentColor) {
        primaryColor = accentColor
    }

    const generateMinutesBar = () => {
        let minuteBar = [];
        for (let i = 0; i < 60; i += minStep) {
            minuteBar.push(i);
        }
        return (
            <>
                {minuteBar.map((minute) => (
                    <TouchableOpacity
                        key={minute}
                        onPress={() => setCurrentTime(currentTime.set('minute', minute))}
                        style={{...styles.timeOption}}
                    >
                        <Text
                            style={{
                                color: currentTime.get('minute') === minute ? primaryColor : 'black',
                                fontSize: 18,
                                fontWeight: '400'
                            }}
                        >
                            {minute > 9 ? minute : '0' + minute}
                        </Text>
                    </TouchableOpacity>
                ))}
            </>
        );
    };

    const generateHoursBar = () => {
        let hoursBar = [];
        for (let i = 0; i <= 23; i += hourStep) {
            if(i >= minHour && i <= maxHour) {
                hoursBar.push(i);
            }
        }
        return (
            <>
                {hoursBar.map((hour) => (
                    <TouchableOpacity
                        key={hour}
                        onPress={() => setCurrentTime(currentTime.set('hour', hour))}
                        style={{...styles.timeOption}}>
                        <Text
                            style={{
                                color: currentTime.get('hour') === hour ? primaryColor : 'black',
                                fontSize: 18,
                                fontWeight: '400'
                            }}
                        >
                            {hour > 9 ? hour : '0' + hour}
                        </Text>
                    </TouchableOpacity>
                ))}
            </>
        );
    };

    return (
        <View style={styles.datePicker}>
            <View style={styles.topContainer}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.hour}>
                        {currentTime.get('hour') < 10
                            ? '0' + currentTime.get('hour')
                            : currentTime.get('hour')}
                    </Text>
                    <Text style={styles.middle}> : </Text>
                    <Text style={styles.minute}>
                        {currentTime.get('minute') < 10
                            ? '0' + currentTime.get('minute')
                            : currentTime.get('minute')}
                    </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Text style={{fontSize: 16, color: 'white'}}>
                        HH
                    </Text>
                    <Text style={{fontSize: 16, color: 'white'}} > : </Text>
                    <Text style={{fontSize: 16, color: 'white'}}>
                        MM
                    </Text>
                </View>
            </View>
                <View style={styles.bottomContainer}>
                    <ScrollView style={{width: 30}}>
                        {generateHoursBar()}
                    </ScrollView>
                    <View style={styles.divider}></View>
                    <ScrollView>
                        {generateMinutesBar()}
                    </ScrollView>

                </View>
                <View style={styles.callButtons}>
                    <TouchableOpacity onPress={onTimeCancel}><Text
                        style={{color: 'black', fontSize: responsiveFontSize(2), marginRight: 5}}>Cancel</Text></TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            onTimeConfirm(
                                defaultDate
                                    .set('hour', currentTime.get('hour'))
                                    .set('minute', currentTime.get('minute'))
                            );
                        }}><Text
                        style={{color: primaryColor ? primaryColor : 'black', fontSize: responsiveFontSize(2), marginRight: 3}}>Ok</Text></TouchableOpacity>
                </View>
        </View>

    );
};

const styles = StyleSheet.create({
    datePicker: {
        width: '90%',
        shadowColor: 'gray',
        shadowOpacity: 0.15,
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 6,
        height: 437,
        alignSelf: 'center',
        top: '20%',
        backgroundColor: 'white',
        elevation: 6,
    },
    topContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: primaryColor,
        color: 'white',
        paddingHorizontal: responsiveWidth(3),
        height: 80
    },
    bottomContainer: {
        flexDirection: 'row',
        padding: 10,
        height: 320,
        flex: 1

    },
    hour: {
        fontSize: 32,
        color: 'white',
    },
    middle: {
        fontSize: 32,
        color: 'white',
    },
    minute: {
        fontSize: 32,
        color: 'white',
    },
    timeOption: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        height: 40
    },
    divider: {
        width: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    callButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 20,
        paddingBottom: 20,
        marginTop: 10,
        marginRight: 0,
        gap: 20
    },
});

export default TimePicker;

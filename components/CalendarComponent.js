import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {showToastMessage} from '../../../util/notificationUtil';
import CalendarGrid from './CalendarGrid'

dayjs.extend(isBetween);

let primaryColor = '#6600ff'
let secondaryColor = '#7033cc'

const CalendarComponent = ({
                               onDateCancel,
                               onDateConfirm,
                               onRangeConfirm,
                               defaultDate,
                               startDate,
                               endDate,
                               mode,
                               accentColor,
                               dateSelectColor,
                               minDate,
                               maxDate
                           }) => {
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState(defaultDate ? defaultDate : startDate);
    const [calendarEndDate, setCalendarEndDate] = useState(endDate);
    const [isStartDateSelected, setIsStartDateSelected] = useState(true);
    const [isEndDateSelected, setIsEndDateSelected] = useState(true);
    const [isMonthGridVisible, setIsMonthGridVisible] = useState(false)
    const [isYearGridVisible, setIsYearGridVisible] = useState(false)


    const monthYearString = currentDate.format('YYYY/MM')

    if (accentColor) {
        primaryColor = accentColor
    }

    if (dateSelectColor) {
        secondaryColor = dateSelectColor
    }


    const dayRowChar = [{text: 'Su', type: 'day'}, {text: 'Mo', type: 'day'}, {text: 'Tu', type: 'day'}, {
        text: 'We',
        type: 'day'
    }, {text: 'Th', type: 'day'}, {text: 'Fr', type: 'day'}, {text: 'Sa', type: 'day'}];

    useEffect(() => {
        if (currentDate.format('YYYY/MM/DD') !== selectedDate.format('YYYY/MM/DD')) {
            setCurrentDate(selectedDate)
        }
    }, [selectedDate]);

    const getCurrentDecade = () => {
        let decade = {}
        let decadeStart = currentDate.set('year', parseInt(currentDate.format('YYYY').slice(0, 3) + '0'));
        decade.startOfDecade = decadeStart.format('YYYY');
        decade.endOfDecade = decadeStart.add(10, 'year').format('YYYY')

        return decade
    }

    const getBackgroundColor = (date) => {
        if (mode === 'date' || mode === 'datetime') {
            return selectedDate.format('YYYY/MM/D') ===
            monthYearString + '/' + date.toString()
                ? secondaryColor
                : 'white';
        } else if (mode === 'range') {
            if (monthYearString + '/' + date.toString() === selectedDate.format('YYYY/MM/D') || monthYearString + '/' + date.toString() === calendarEndDate.format('YYYY/MM/D')) {
                return secondaryColor
            } else if (
                dayjs(monthYearString + '/' + date.toString()).isBetween(
                    selectedDate.format('YYYY/MM/D'),
                    calendarEndDate.format('YYYY/MM/D'),
                    null,
                    '()'
                )
            ) {
                return secondaryColor.toString() + '70';
            } else {
                return 'white';
            }
        }
    };

    const getColor = (date) => {
        if (mode === 'date' || mode === 'datetime') {
            if (
                (minDate && (dayjs(monthYearString + '/' + date.toString()).isBefore(
                        dayjs(minDate).subtract(1, "day")
                    )) ||
                 (maxDate &&
                    dayjs(monthYearString + '/' + date.toString()).isAfter(maxDate)))
            ) {
                return "gray";
            } else {
                return selectedDate.format('YYYY/MM/D') ===
                monthYearString + '/' + date.toString()
                    ? 'white'
                    : dayjs().format('YYYY/MM/D') ===
                    currentDate.format('YYYY/MM') + '/' + date.toString()
                        ? primaryColor
                        : 'black';
            }

        } else if (mode === 'range') {
            if (
                (minDate && (dayjs(monthYearString + '/' + date.toString()).isBefore(
                        dayjs(minDate).subtract(1, "day")
                    )) ||
                    (maxDate &&
                        dayjs(monthYearString + '/' + date.toString()).isAfter(maxDate)))
            ) {
                return "gray";
            } else {
                if (
                    dayjs(monthYearString + '/' + date.toString()).isBetween(
                        selectedDate.format('YYYY/MM/D'),
                        calendarEndDate.format('YYYY/MM/D'),
                        null,
                        '[]'
                    )
                ) {
                    return 'white';
                } else if (
                    currentDate.format('YYYY/MM/D') ===
                    date.toString() + ' ' + dayjs().format('YYYY/MM/D')
                ) {
                    return primaryColor;
                } else {
                    return 'black';
                }
            }
        }
    };

    const increase = (type) => {
        if (isYearGridVisible) {
            setCurrentDate(currentDate.add(10, 'year'))
        } else {
            if (type === 'month') {
                setCurrentDate(currentDate.add(1, 'month'))
            } else if (type === 'year') {
                setCurrentDate(currentDate.add(1, 'year'))
            }
        }

    };

    const decrease = (type) => {
        if (isYearGridVisible) {
            setCurrentDate(currentDate.subtract(10, 'year'))
        } else {
            if (type === 'month') {
                setCurrentDate(currentDate.subtract(1, 'month'))
            } else if (type === 'year') {
                setCurrentDate(currentDate.subtract(1, 'year'))
            }
        }

    };

    const dayRow = () => {

        return (
            !isMonthGridVisible && !isYearGridVisible && <CalendarGrid
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                data={dayRowChar}
                columnNum={7}
                itemColor='#6600ff'
            />
        );
    };

    const dateMatrix = () => {
        let currentMonthDateMatrix = [];

        if (currentDate.startOf('month').day() !== 0) {
            let prevMonth = currentDate.subtract(1, 'month');
            for (let i = 0; i < currentDate.startOf('month').day(); i++) {
                currentMonthDateMatrix.unshift(
                    {text: prevMonth.endOf('month').subtract(i, 'day').date(), type: 'prevMonth'}
                );
            }
        }

        for (
            let i = currentDate.startOf('month').date();
            i <= currentDate.endOf('month').date();
            i++
        ) {
            currentMonthDateMatrix.push({text: i, type: 'currentMonth'});
        }

        if (currentDate.endOf('month').day() !== 6) {
            let nextMonth = currentDate.add(1, 'month');
            for (let i = currentDate.endOf('month').day(); i < 6; i++) {
                currentMonthDateMatrix.push(
                    {
                        text: nextMonth
                            .startOf('month')
                            .add(i - currentDate.endOf('month').day(), 'day')
                            .date(),
                        type: 'nextMonth'
                    }
                );
            }
        }

        return (
            <View style={styles.dateMatrix}>
                {
                    (!isMonthGridVisible && !isYearGridVisible && <CalendarGrid
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        data={currentMonthDateMatrix}
                        columnNum={7}
                        itemColor={'gray'}
                        onPress={handleDateSelect}
                        getTextColor={getColor}
                        getTextBackgroundColor={getBackgroundColor}
                        monthYearString={monthYearString}
                        setCurrentDate={setCurrentDate}
                        currentDate={currentDate}
                        selectedDate={selectedDate}
                        minDate={minDate}
                        maxDate={maxDate}
                    />)
                }
            </View>
        );
    };

    const handleMonthSelect = (month) => {
        setCurrentDate(currentDate.set('month', month))
        setIsMonthGridVisible(false)
        setIsYearGridVisible(false)
    }

    const handleYearSelect = (year) => {
        let yearNum = parseInt(year)
        setCurrentDate(currentDate.set('year', yearNum))
        setIsYearGridVisible(false)
    }

    const monthMatrix = () => {
        let currentYearMonthMatrix = []

        for (let i = 0; i < 12; i++) {
            currentYearMonthMatrix.push({text: dayjs().set('month', i).format('MMM'), type: 'month', month: i})
        }

        return (
            isMonthGridVisible && !isYearGridVisible && <CalendarGrid
                data={currentYearMonthMatrix}
                columnNum={3}
                itemColor={'gray'}
                onPress={handleMonthSelect}
                getTextColor={getColor}
                getTextBackgroundColor={getBackgroundColor}
                monthYearString={monthYearString}
                setCurrentDate={setCurrentDate}
                currentDate={currentDate}
                selectedDate={selectedDate}
                secondaryColor={secondaryColor}
            />
        )
    }

    const yearMatrix = () => {
        let currentDecadeYearMatrix = []

        let decadeStart = currentDate.set('year', parseInt(currentDate.format('YYYY').slice(0, 3) + '0'));

        for (let i = -1; i < 11; i++) {
            currentDecadeYearMatrix.push({text: decadeStart.add(i, 'year').format('YYYY'), type: 'year'})
        }


        return (
            isYearGridVisible && <CalendarGrid
                data={currentDecadeYearMatrix}
                columnNum={3}
                itemColor={'gray'}
                onPress={handleYearSelect}
                getTextColor={getColor}
                getTextBackgroundColor={getBackgroundColor}
                monthYearString={monthYearString}
                setCurrentDate={setCurrentDate}
                currentDate={currentDate}
                selectedDate={selectedDate}
                secondaryColor={secondaryColor}
            />
        )
    }

    const handleDateSelect = (date) => {
        if (mode === "date" || mode === "datetime") {
            setSelectedDate(date);
        } else if (mode === "range") {
            if (!isStartDateSelected) {
                setSelectedDate(dayjs(date));
                setIsStartDateSelected(true);
                setIsEndDateSelected(false);
            } else if (!isEndDateSelected && dayjs(date).isAfter(selectedDate)) {
                setCalendarEndDate(dayjs(date));
                setIsEndDateSelected(true);
            } else if (!isEndDateSelected && dayjs(date).isBefore(selectedDate)) {
                setSelectedDate(dayjs(date));
                setCalendarEndDate(dayjs(date));
                setIsStartDateSelected(true);
                setIsEndDateSelected(false);
            } else if (isStartDateSelected && isEndDateSelected) {
                setSelectedDate(dayjs(date));
                setCalendarEndDate(dayjs(date));
                setIsStartDateSelected(true);
                setIsEndDateSelected(false);
            }
        }
    };

    const handleDateConfirm = () => {
        if (mode === 'date' || mode === 'datetime') {
            onDateConfirm(selectedDate);
        } else if (mode === 'range') {
            if (!selectedDate.isSame(calendarEndDate)) {
                onRangeConfirm(selectedDate, calendarEndDate);
            } else {
                showToastMessage('Please Select a range');
            }
        }
    };

    const handleClickToday = () => {
        setSelectedDate(dayjs())
    }

    return (

        <View style={styles.calendar}>
            <View style={{...styles.topContainer, backgroundColor: primaryColor}}>
                <View style={styles.buttonGroup}>
                    {<TouchableOpacity onPress={() => decrease('year')} activeOpacity={0.8}>
                        <Text style={styles.buttons}>{'<<'}</Text>
                    </TouchableOpacity>}
                    {!isMonthGridVisible && !isYearGridVisible &&
                        <TouchableOpacity onPress={() => decrease('month')} activeOpacity={0.8}>
                            <Text style={styles.buttons}>{'<'}</Text>
                        </TouchableOpacity>}
                </View>
                <View style={styles.monthYear}>
                    {!isMonthGridVisible && !isYearGridVisible && (
                        <TouchableOpacity onPress={() => setIsMonthGridVisible(true)}>
                            <Text style={styles.month}>{currentDate.format('MMM')}</Text>
                        </TouchableOpacity>
                    )}
                    {!isYearGridVisible && (
                        <TouchableOpacity onPress={() => {
                            setIsYearGridVisible(true)
                            setIsMonthGridVisible(true)
                        }}>
                            <Text style={styles.year}>{currentDate.format('YYYY')}</Text>
                        </TouchableOpacity>
                    )}
                    {
                        isYearGridVisible && (
                            <View style={{flexDirection: 'row'}}>
                                <Text
                                    style={{...styles.year, flexDirection: 'row'}}>{getCurrentDecade().startOfDecade}</Text>
                                <Text style={{...styles.year, flexDirection: 'row'}}>{' - '}</Text>
                                <Text style={{...styles.year, flexDirection: 'row'}}>{getCurrentDecade().endOfDecade}</Text>
                            </View>
                        )
                    }
                </View>
                <View style={styles.buttonGroup}>
                    {!isMonthGridVisible && !isYearGridVisible &&
                        <TouchableOpacity onPress={() => increase('month')} activeOpacity={0.8}>
                            <Text style={styles.buttons}>{'>'}</Text>
                        </TouchableOpacity>}
                    {<TouchableOpacity onPress={() => increase('year')} activeOpacity={0.8}>
                        <Text style={styles.buttons}>{'>>'}</Text>
                    </TouchableOpacity>}
                </View>
            </View>
            <View style={styles.bottomContainer}>
                {dayRow()}
                {dateMatrix()}
                {monthMatrix()}
                {yearMatrix()}
                {!isMonthGridVisible && !isYearGridVisible && (<View style={styles.callButtons}>
                    <View>
                        {!(mode === 'range') && <TouchableOpacity onPress={handleClickToday} activeOpacity={0.8}>
                            <Text style={{...styles.primary, marginLeft: 0, color: primaryColor}}>Today</Text>
                        </TouchableOpacity>}
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={onDateCancel} activeOpacity={0.8}>
                            <Text style={styles.secondary}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDateConfirm} activeOpacity={0.8}>
                            <Text style={{...styles.primary, color: primaryColor}}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </View>)}
            </View>

        </View>

    );
};

const styles = StyleSheet.create({

    calendar: {
        width: '90%',
        shadowColor: 'gray',
        shadowOpacity: 0.15,
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 6,
        position: 'relative',
        alignSelf: 'center',
        top: '20%',
        elevation: 8,
        borderColor: 'white',
        borderWidth: 0.1,
        backgroundColor: 'white',
        zIndex: 1000,
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(3),
        height: 80
    },
    bottomContainer: {
        backgroundColor: 'white',
        height: 'auto',
        padding: 12,
    },
    monthYear: {
        color: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
    },
    month: {
        fontSize: responsiveFontSize(3),
        fontWeight: 400,
        color: 'white'
    },
    year: {
        fontSize: responsiveFontSize(2.6),
        fontWeight: 600,
        color: 'white'
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        gap: 10
    },
    buttons: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 20,
        width: 36,
        height: 36,
        borderWidth: 1,
        borderColor: 'transparent',
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: 28,
        fontSize: 20,
    },
    dayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    day: {
        fontSize: 12,
        color: primaryColor,
        borderColor: 'red'
    },
    dateMatrix: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: 20,
        alignSelf: 'center',
    },

    prevMonthDates: {
        width: 24,
        height: 24,
        color: 'gray',
        fontWeight: '200',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    nextMonthDates: {
        width: 24,
        height: 24,
        color: 'gray',
        fontWeight: '200',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    currentMonthDates: {
        width: 26,
        height: 26,
        color: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        fontWeight: "800",
    },
    date: {
        fontSize: responsiveFontSize(1.8),
        fontWeight: '500',

    },
    callButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(3),
        marginTop: 20,
        marginBottom: 10,
    },
    primary: {
        backgroundColor: 'transparent',
        marginLeft: 25,
        fontSize: responsiveFontSize(2)
    },
    secondary: {
        backgroundColor: 'transparent',
        fontSize: responsiveFontSize(2)
    },
});

export default CalendarComponent;




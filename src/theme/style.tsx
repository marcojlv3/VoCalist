import { StyleSheet } from 'react-native';

const colors = {
    primary:'#6405FF',
    secondary:'#EB736C',
    white:'#FFFFFF',
    grey:'#767676',
    backgroundGrey:'#DDDDDD',
    lightGrey:'#E6E6E6',
    lighterGrey:'#F9F9F9',
    lightBlack:'#484848',
    levelColors:[
        '#128F56',
        '#0777C6',
        '#E80D3F'
    ],
    black:'#000000',
    yellow:'#FFC700'
}

const borderRadius = 20;
const iconSize = 24;
const bigIconSize = 48;

const styles = StyleSheet.create({
    
    itemListContainer: {
        height:  124,
        borderRadius: borderRadius,
        //borderWidth: 3,
        paddingTop: '2%',
        paddingLeft: '4%',
        margin:'2%',
        position: 'relative',
        backgroundColor: colors.white,
    },
    continueIcon: {
        color: colors.white,
        position: 'absolute',
        right: '5%',
        top: '43%',
        zIndex: 1
    },
    musclesLevelContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '60%',
        alignItems: 'center'
    },
    level: {
        fontWeight: 'bold',
    },
    image: {
        width: '30%',
        height: 124,
        position: 'absolute',
        overflow:'hidden',
        right: 0,
        resizeMode: 'cover',
        borderBottomLeftRadius: 50,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16
    },
    timeContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '50%',
        alignItems: 'center',
        position: 'absolute',
        top: '11%',
        right: '7%'
    },
    rowContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    separator:{
        height: 2,
        width: '94%',
        backgroundColor: colors.primary,
        alignSelf:'center',
        borderRadius: 2,

    },
    cancelButton:{
        backgroundColor:colors.white,
        borderColor:colors.grey,
        borderWidth:2,
    },
    backgroundModal:{
        backgroundColor:colors.black,
        opacity: 0.5,
        position:'absolute',
        width:'100%',
        height:'100%',
        zIndex: 0
    },
    centerModal:{
        justifyContent:'center',   
        height:'100%',
        zIndex:1
    },
    modalContainer:{
        backgroundColor:colors.white,
        marginStart:'5%',
        marginRight:'5%',
        padding:'5%',
        alignItems:'center',
        borderRadius:borderRadius,
    },
    

});

export {colors, borderRadius, iconSize, bigIconSize,  styles};
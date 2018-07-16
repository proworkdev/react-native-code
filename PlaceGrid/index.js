import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Spinner } from 'native-base';
import { addFavouritePlace, removeFavouritePlace } from '../../store/favourite/duck';
import globalStyles from '../../assets/globalcss';
import { alert } from '../../utils/methods';
import imgShadow from '../../../img/img_shadow.png';
import blackShadow from '../../../img/img_shadow_black.png';
import NotFound from '../NotFound';
import NavigatorService from '../../utils/navigation';
import BannerItem from '../BannerItem';

const { width } = Dimensions.get('window');
let indexColor = true;

class PlaceGrid extends Component {
  getColor = (index) => {
    if (index === 0) { return imgShadow; }
    if (indexColor) {
      if (index % 2) {
        indexColor = false;
        return blackShadow;
      }
      return imgShadow;
    }
    if (index % 2) {
      indexColor = true;
      return imgShadow;
    }
    return blackShadow;
  };

  addFavourite = ({ id }) => {
    const places = this.updatePlaces(true, id);
    alert('Added to Favourite', 'success');
    this.props.addFavouritePlace({ data: { placeId: id }, places });
  }

  removeFavourite= ({ id }) => {
    const places = this.updatePlaces(false, id);
    alert('Removed from Favourite');
    this.props.removeFavouritePlace({ data: { placeId: id }, places });
  }

  updatePlaces = (value, id) => {
    const { places } = this.props.placesStore;
    const index = places.findIndex(place => place.id === id);
    places[index].isPlannedForUser = value;
    return places;
  }


  gotoPlaceDetail = id => NavigatorService.navigate('PlaceDetail', { id });

  render() {
    const { places, phase } = this.props.placesStore;
    return (
      <View style={styles.viewWrap}>
        {!places.length && <Spinner color="red" style={globalStyles.loader} />}
        {places.map((place, index) =>
          (
            <View style={styles.mainView} key={place.id}>
              <BannerItem
                item={place}
                width="100%"
                height={width / 2.1}
                favourite
                onAddFavourite={item => this.addFavourite(item)}
                onRemoveFavourite={item => this.removeFavourite(item)}
                index={index}
                place
                shadow={this.getColor(index)}
              />
            </View>
        ))}
        {phase !== 'LOADING' && places.length === 0 ?
          <NotFound />
              :
              null}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  viewWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mainView: {
    width: '50%',
    padding: 2,
    paddingTop: 0,
  },
  imgStyle: {
    flex: 1,
    width: '100%',
    height: width / 2.1,
  },
  placeTitleHeading: {
    color: '#fff',
    fontFamily: 'HelveticaNeue-Bold',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authorHeading: {
    color: '#fff',
    fontFamily: 'HelveticaNeue-Bold',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imgBottom: {
    position: 'absolute',
    zIndex: 999,
    bottom: 10,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: 40,
    width: '100%',
  },
  favView: {
    position: 'absolute',
    backgroundColor: 'transparent',
    right: 10,
  },
  textView: {
    backgroundColor: 'transparent',
    marginLeft: 12,
  },
});

PlaceGrid.propTypes = {
  addFavouritePlace: PropTypes.func,
  removeFavouritePlace: PropTypes.func,
  placesStore: PropTypes.object,
};

const mapStateToProps = ({ placesStore }) => (
  { placesStore }
);

const mapDispatchToProps = {
  addFavouritePlace: placeId => addFavouritePlace(placeId),
  removeFavouritePlace: placeId => removeFavouritePlace(placeId),
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceGrid);

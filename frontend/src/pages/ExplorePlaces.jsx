import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { stayService } from '../services/stay.service';
import { GoogleMap } from '../cmps/GoogleMap';
import { GoogleMapMarker } from '../cmps/GoogleMapMarker';
import { Loader } from '../cmps/Loader';
import { StayPreview } from '../cmps/ExplorePlaces/StayPreview';
import { ExploreHeader } from '../cmps/ExplorePlaces/ExploreHeader';
import { ReactComponent as MapIcon } from '../assets/imgs/icons/general/icon-map.svg';
import { ReactComponent as ListIcon } from '../assets/imgs/icons/general/icon-list.svg';

export const ExplorePlaces = () => {
    const { isGoogleScriptLoaded } = useSelector(state => state.pageModule);
    const [filterBy, setFilter] = useState({});
    const [isListView, setListView] = useState(true);
    const [stays, setStays] = useState(null);
    const listRef = useRef(null);
    const mapRef = useRef(null);

    // filterBy = {
    //     type: ['entire place', 'private room','hotel room','shared room'],
    //     minPrice, 
    //     maxPrice,
    //     superhost: true,
    //     amenities: ['dryer','wifi','dedicated workspace'],
    //     propertyType: ['loft','condo','rental unit'],
    //     unique: ['tree house','camper/RV','tent','tiny house'],
    // }

    const StayMarker = (stay) => {
        const markerOpts = {
            position: stay.loc.pos,
            label: {
                text: `$${Math.round(stay.price)}`,
                color: '#000',
                fontSize: '0.875rem',
                lineHeight: '1.125rem',
                fontFamily: 'AirbnbCereal-Bold'
            },
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 9,
                strokeColor: '#fff',
                strokeWeight: 20,
            }
        };
        const targetUrl = `https://myhomeaway.herokuapp.com/stay/${stay._id}`;
        return <GoogleMapMarker key={stay._id} options={markerOpts} targetUrl={targetUrl} />;
    };

    useEffect(() => {
        document.title = "HomeAway: Explore stays";
        (async () => {
            const queryStays = await stayService.query(filterBy);
            setStays(queryStays);
        })();
    }, [filterBy]);

    const toggleView = () => {
        listRef.current.classList.toggle('active');
        mapRef.current.classList.toggle('active');
        setListView(prevState => !prevState);
    };

    if (!stays) return <Loader />

    return (
        <section className="explore main-content content-wrapper">
            <div className="explore-header-wrapper">
                <ExploreHeader filterBy={filterBy} setFilter={setFilter} />
            </div>

            <section className="explore-content flex">
                <section ref={listRef} className="explore-listings active">
                    {stays.length ?
                        stays.map(stay => <StayPreview key={stay._id} stay={stay} />) :
                        <span className="no-stays">
                            <h3 className="fs22">No results</h3>
                            <p>Try adjusting your search by changing your dates, removing
                                filters, or zooming out on the map</p>
                        </span>
                    }
                    {Object.keys(filterBy).length ?
                        <button className="remove-filter title fs14"
                            onClick={() => setFilter({})}>Remove all filters</button>
                        : ''}

                </section>

                <section ref={mapRef} className="explore-map">
                    {isGoogleScriptLoaded ?
                        <GoogleMap zoom={12} center={{ lat: 32.07440344333568, lng: 34.77544709894273 }}>
                            {stays.map(stay => StayMarker(stay))}
                        </GoogleMap>
                        : <Loader />}
                </section>

                <button className="switch-view fs14 flex align-center"
                    onClick={toggleView}>
                    <span>
                        Show {isListView ? "map" : "list"}
                    </span>
                    {isListView ? <MapIcon /> : <ListIcon />}
                </button>
            </section>
        </section>
    );
};
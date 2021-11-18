import { ReactComponent as StarIcon } from '../../assets/imgs/icons/general/icon-star.svg';
import { ReactComponent as ShareIcon } from '../../assets/imgs/icons/general/icon-share.svg';
import { ReactComponent as HeartIcon } from '../../assets/imgs/icons/general/icon-heart.svg';

export const StayHeader = ({ stay }) => {
    return (
        <section className="stay-header flex column">
            <h1 className="title">{stay.title}</h1>
            <span className="sub-header flex align-center space-between">
                <div className="info flex align-center">
                    <span className="rating flex align-center">
                        <StarIcon />
                        {stay.rating.total}
                    </span>
                    <button className="reviews">({stay.reviews.length} review{stay.reviews.length > 1 && "s"})</button>
                    <span className="sep">·</span>
                    <span className="location">{stay.loc.city}, {stay.loc.country}</span>
                </div>
                <div className="actions flex align-center">
                    <button className="share flex align-center">
                        <ShareIcon />
                        Share
                    </button>
                    <button className="save flex align-center">
                        <HeartIcon />
                        Save
                    </button>
                </div>
            </span>

        </section>
    );
};
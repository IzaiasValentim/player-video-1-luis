
const TrackListItem = ({ video, index, isSelected, onSelect }) => {
    return (
        <div
            className={`track-list-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(index)}
        >
            <div className="track-info">
                <span className="track-index">{index + 1}.</span>
                <span className="track-name">{video.name}</span>
            </div>
            <div className="track-artist">{video.artist}</div>
        </div>
    );
};

export default TrackListItem;
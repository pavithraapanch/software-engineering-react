import React from "react";

const TuitStats = ({tuit, likeTuit, dislikeTuit = () => {}}) => {
    return (
        <div className="row mt-2">
            <div className="col">
                <i className="far fa-message me-1"></i>
                {tuit.stats && <span className="ttr-stats-replies">{tuit.stats.replies}</span>}
            </div>
            <div className="col">
                <i className="far fa-retweet me-1"></i>
                {tuit.stats && <span className="ttr-stats-retuits">{tuit.stats.retuits}</span>}
            </div>
            <div className="col">
          <span className="ttr-like-tuit-click" onClick={() => likeTuit(tuit)}>
              {
                  tuit.stats && tuit.stats.likes && tuit.stats.likes > 0 &&
                  <i className="fas fa-thumbs-up me-1" style={{color: 'blue'}}></i>
              }
              {
                  tuit.stats && tuit.stats.likes && tuit.stats.likes <= 0 &&
                  <i className="fas fa-thumbs-up me-1"></i>
              }
              <span className="ttr-stats-likes">{tuit.stats && tuit.stats.likes}</span>
          </span>
            </div>
            <div className="col">
          <span className="ttr-dislike-tuit-click" onClick={() => dislikeTuit(tuit)}>
              {
                  tuit.stats && tuit.stats.dislikes && tuit.stats.dislikes > 0 &&
                  <i className="fas fa-thumbs-down me-1" style={{color: 'blue'}}></i>
              }
              {
                  tuit.stats && tuit.stats.dislikes && tuit.stats.dislikes <= 0 &&
                  <i className="fas fa-thumbs-down me-1"></i>
              }
              <span className="ttr-stats-dislikes">{tuit.stats && tuit.stats.dislikes}</span>
          </span>
            </div>
            <div className="col">
                <i className="far fa-inbox-out"></i>
            </div>
        </div>
    );
}
export default TuitStats;
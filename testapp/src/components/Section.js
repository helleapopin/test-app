import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Section({ currentStep }) {
  const navigate = useNavigate();
  const apiUrl = 'https://fictional-orbit-695pwwpvgqj7c5qrr-8080.app.github.dev/api/submit'; // Single API endpoint

  // Load saved draft when the page loads
  const [formData, setFormData] = useState(() => {
    const savedDraft = localStorage.getItem('sectionDraft');
    return savedDraft ? {
      ...JSON.parse(savedDraft), images: JSON.parse(savedDraft).images || []
    } : {
      // Section 1 Fields
      priority: 'Low',
      dueDate: '',
      roadName: '',
      atKm: '',
      latitude: '',
      longitude: '',
      nearestTown: '',
      pids: '',


      // Section 2 Fields
      proximityToWaterbody: '',
      largeBodyFishName: '',
      smallBodyFishName: '',
      fishPassageDesignRequired: '',
      fishSpawningWindows: '',
      commentsBodiesOfWater: '',
      additionalComments: '',

      // Section 3 Fields
      dfoReviewRequired: '',
      dfoComments: '',

      // Section 4 Fields
      ahppRequired: '',
      ahppComments: '',
      ahppAdditionalComments: '',

      // Section 5 Fields
      rareEndangeredSpecies: '',
      speciesComments: '',

      // Section 6 Fields
      erosionSedimentControlComments: '',

      // Section 7 Fields
      cofferdamsComments: '',

      // Section 8 Fields
      inProvincialForest: '',
      forestProductPermitRequired: '',
      merchantableTimberPermitRequired: '',
      forestPermitComments: "",

      // Section 9 Fields
      impactedSitesComments: "",

      // Section 10 Fields
      additionalPermitsComments: "",
      images: [],
    };
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  // Save draft whenever user types
  useEffect(() => {
    localStorage.setItem('sectionDraft', JSON.stringify(formData));
  }, [formData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    // Convert images to Base64
    const imagePromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result); // Convert to Base64
        reader.onerror = (error) => reject(error);
      });
    });

    try {
      const base64Images = await Promise.all(imagePromises); // Convert all images

      setFormData((prevData) => {
        const updatedData = {
          ...prevData,
          images: [...(prevData.images || []), ...base64Images], // Store new images
        };
        localStorage.setItem('sectionDraft', JSON.stringify(updatedData)); // Save to localStorage
        return updatedData;
      });
    } catch (error) {
      console.error("Error converting images:", error);
    }
  };

  // Function to delete an image
  const handleDeleteImage = (e, index) => {
    e.preventDefault();  // Prevents the form from submitting
    e.stopPropagation(); // Prevents the button click from triggering form events

    setFormData((prevData) => {
      const updatedImages = [...prevData.images];
      updatedImages.splice(index, 1); // Remove the selected image

      const updatedData = {
        ...prevData,
        images: updatedImages,
      };

      localStorage.setItem('sectionDraft', JSON.stringify(updatedData)); // Save changes
      return updatedData;
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images') {
        value.forEach((file) => formDataToSend.append('images', file));
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await axios.post(apiUrl, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 200) {
        alert('Data submitted successfully!');
        localStorage.removeItem('sectionDraft');
        navigate('/');
      } else {
        alert('Failed to submit data');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('An error occurred while submitting the form');
    }
  };


  const handleReview = (e) => {
    e.preventDefault(); // Prevent form from submitting
    localStorage.setItem('reviewData', JSON.stringify(formData));
    navigate(`/review`); // Redirect to review page
  };


  return (
    <div className="section-container">
      <button className="btn btn-secondary back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <h2 className="section-title">
        {`Section ${currentStep}`} - {
          currentStep === 1 ? 'Project Location' :
            currentStep === 2 ? 'Fish Passage Design Requirements' :
              currentStep === 3 ? 'DFO Approval / Request for Review' :
                currentStep === 4 ? 'Aquatic Habitat Protection Permit (AHPP)' :
                  currentStep === 5 ? 'Rare, Endangered, & Identified Species' :
                    currentStep === 6 ? 'Erosion and Sediment Control' :
                      currentStep === 7 ? 'Cofferdams' :
                        currentStep === 8 ? 'Forest Permit' :
                          currentStep === 9 ? 'Impacted Sites' :
                            'Additional Permits'
        }
      </h2>

      <form onSubmit={handleReview}>
        {currentStep === 1 && (
          <>
            <div style={styles.row}>
              <div style={styles.field}>
                <label>Priority:</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="form-control">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div style={styles.field}>
                <label>Due Date:</label>
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="form-control" />
              </div>
            </div>

            {/* Row 2: Road Name & At Km */}
            <div style={styles.row}>
              <div style={styles.field}>
                <label>Road Name:</label>
                <input type="text" name="roadName" value={formData.roadName} onChange={handleChange} className="form-control" placeholder="Enter road name..." />
              </div>
              <div style={styles.field}>
                <label>At Km:</label>
                <input type="text" name="atKm" value={formData.atKm} onChange={handleChange} className="form-control" placeholder="e.g. 4.87" />
              </div>
            </div>

            {/* Row 3: Latitude & Longitude */}
            <div style={styles.row}>
              <div style={styles.field}>
                <label>Latitude:</label>
                <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} className="form-control" placeholder="e.g. 51.7609" />
              </div>
              <div style={styles.field}>
                <label>Longitude:</label>
                <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} className="form-control" placeholder="e.g. -103.9029" />
              </div>
            </div>

            {/* Row 4: Nearest Town & PIDs */}
            <div style={styles.row}>
              <div style={styles.field}>
                <label>Nearest Town:</label>
                <input type="text" name="nearestTown" value={formData.nearestTown} onChange={handleChange} className="form-control" placeholder="Enter town name..." />
              </div>
              <div style={styles.field}>
                <label>PIDs:</label>
                <input type="text" name="pids" value={formData.pids} onChange={handleChange} className="form-control" placeholder="e.g. CUL238114" />
              </div>
            </div>

          </>
        )}

        {currentStep === 2 && (
          <>
            <div style={styles.row}>
              <div style={styles.field}>
                <label>Proximity to Fish-Bearing Waterbody:</label>
                <input
                  type="text"
                  name="proximityToWaterbody"
                  value={formData.proximityToWaterbody}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter proximity details..."
                />
              </div>
              <div style={styles.field}>
                <label>Large Body Fish Name:</label>
                <input
                  type="text"
                  name="largeBodyFishName"
                  value={formData.largeBodyFishName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter large body fish name..."
                />
              </div>
            </div>

            {/* Row 2: Small Fish Name & Fish Passage Required */}
            <div style={styles.row}>
              <div style={styles.field}>
                <label>Small Body Fish Name:</label>
                <input
                  type="text"
                  name="smallBodyFishName"
                  value={formData.smallBodyFishName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter small body fish name..."
                />
              </div>
              <div style={styles.field}>
                <label>Fish Passage Design Required?</label>
                <select
                  name="fishPassageDesignRequired"
                  value={formData.fishPassageDesignRequired}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {/* Row 3: Fish Spawning Windows & Comments */}
            <div style={styles.row}>
              <div style={styles.field}>
                <label>Fish Spawning Windows:</label>
                <input
                  type="text"
                  name="fishSpawningWindows"
                  value={formData.fishSpawningWindows}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter fish spawning windows..."
                />
              </div>
              <div style={styles.field}>
                <label>Comments on Bodies of Water:</label>
                <input
                  type="text"
                  name="commentsBodiesOfWater"
                  value={formData.commentsBodiesOfWater}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter comments..."
                />
              </div>
            </div>

            {/* Row 4: Additional Comments (Full Width) */}
            <div style={styles.fullWidthField}>
              <label>Additional Comments:</label>
              <textarea
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter additional comments..."
                rows="3"
              />
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div className="row">
              <div className="field">
                <label>DFO Review Required?</label>
                <select
                  name="dfoReviewRequired"
                  value={formData.dfoReviewRequired}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            {/* Row 2: Comments */}
            <div className="row">
              <div className="field">
                <label>Comments on DFO:</label>
                <textarea
                  name="dfoComments"
                  value={formData.dfoComments}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter comments..."
                />
              </div>
            </div>
          </>
        )}

        {currentStep === 4 && (
          <>
            {/* Row 1: AHPP Required */}
            <div className="row">
              <div className="field">
                <label>AHPP Required?</label>
                <select
                  name="ahppRequired"
                  value={formData.ahppRequired}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {/* Row 2: Comments on AHPP */}
            <div className="row">
              <div className="field">
                <label>Comments on AHPP:</label>
                <textarea
                  name="ahppComments"
                  value={formData.ahppComments}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter comments..."
                />
              </div>
            </div>

            {/* Row 3: Additional Comments */}
            <div className="row">
              <div className="field">
                <label>Additional Comments:</label>
                <textarea
                  name="ahppAdditionalComments"
                  value={formData.ahppAdditionalComments}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter additional comments..."
                />
              </div>
            </div>

          </>
        )}


        {currentStep === 5 && (
          <>
            {/* Row 1: Rare or Endangered Species */}
            <div className="row">
              <div className="field">
                <label>Are rare or endangered species present?</label>
                <select
                  name="rareEndangeredSpecies"
                  value={formData.rareEndangeredSpecies}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {/* Row 2: Comments */}
            <div className="row">
              <div className="field">
                <label>Comments (species and mitigation measures):</label>
                <textarea
                  name="speciesComments"
                  value={formData.speciesComments}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter comments..."
                />
              </div>
            </div>
          </>
        )}


        {currentStep === 6 && (
          <>
            {/* Row 1: Comments */}
            <div className="row">
              <div className="field">
                <label>Erosion and Sediment Control Comments:</label>
                <textarea
                  name="erosionSedimentControlComments"
                  value={formData.erosionSedimentControlComments}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter comments..."
                />
              </div>
            </div>
          </>
        )}


        {currentStep === 7 && (
          <>
            {/* Row 1: Comments */}
            <div className="row">
              <div className="field">
                <label>Cofferdams Comments:</label>
                <textarea
                  name="cofferdamsComments"
                  value={formData.cofferdamsComments}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter comments..."
                />
              </div>
            </div>
          </>
        )}


        {currentStep === 8 && (
          <>
            {/* Row 1: Is this location in provincial forest? */}
            <div className="row">
              <div className="field">
                <label>Is this location in provincial forest?</label>
                <select
                  name="inProvincialForest"
                  value={formData.inProvincialForest}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="field">
                <label>Is forest product permit required?</label>
                <select
                  name="forestProductPermitRequired"
                  value={formData.forestProductPermitRequired}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {/* Row 2: Is merchantable timber permit required? */}
            <div className="row">
              <div className="field">
                <label>Is merchantable timber permit required?</label>
                <select
                  name="merchantableTimberPermitRequired"
                  value={formData.merchantableTimberPermitRequired}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {/* Row 3: Comments */}
            <div className="row">
              <div className="field">
                <label>Comments on Forest Permits:</label>
                <textarea
                  name="forestPermitComments"
                  value={formData.forestPermitComments}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter comments..."
                />
              </div>
            </div>
          </>
        )}

        {currentStep === 9 && (
          <>
            {/* Row 1: Comments */}
            <div className="row">
              <div className="field">
                <label>Impacted Sites Comments:</label>
                <textarea
                  name="impactedSitesComments"
                  value={formData.impactedSitesComments}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter comments..."
                />
              </div>
            </div>
          </>
        )}


        {currentStep === 10 && (
          <>
            {/* Row 1: Comments */}
            <div className="row">
              <div className="field">
                <label>Additional Permits Comments:</label>
                <textarea
                  name="additionalPermitsComments"
                  value={formData.additionalPermitsComments}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter comments..."
                />
              </div>
            </div>


            {/* Image Upload Section */}
            <div className="row">
              <div className="field">
                <label>Upload Images:</label>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="form-control" />
              </div>
            </div>

            {/* Display Image Previews */}
            {formData.images && formData.images.length > 0 && (
              <div className="image-preview-container">
                {formData.images
                  .filter(image => image.startsWith("data:image")) // Only keep valid images
                  .map((image, index) => (
                    <div key={index} className="image-preview-wrapper">
                      <img src={image} alt={`Uploaded ${index}`} className="image-preview" />
                      <button className="delete-button" onClick={(e) => handleDeleteImage(e, index)}>✖</button>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}

        {/* Navigation Buttons */}
        <div className="button-container">
          {currentStep > 1 && <button type="button" className="btn btn-info" onClick={() => navigate(`/section${currentStep - 1}`)}>Back</button>}
          {currentStep < 10 && <button type="button" className="btn btn-primary" onClick={() => navigate(`/section${currentStep + 1}`)}>Next</button>}
          <button type="submit" className="btn btn-success">Review and Submit</button>
        </div>
      </form>
    </div>
  );
}

// Styles
const styles = {
  sectionContainer: {
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.1)', // Transparent glass effect
    backdropFilter: 'blur(15px)', // Frosted-glass blur
    WebkitBackdropFilter: 'blur(15px)', // Safari support
    borderRadius: '20px',
    border: '2px solid rgba(255, 255, 255, 0.2)', // Subtle border
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)', // Soft shadow
    color: 'white', // Ensure text is readable on the glass background
    maxWidth: '95%',
    margin: '40px auto 0',
    overflow: 'hidden',
  },
  backButton: {
    marginBottom: '1rem',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  row: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  field: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '220px',
  },
  buttonContainer: {
    display: "",
    justifyContent: 'center',  // Centers buttons
    gap: '10px', // Adds spacing between buttons
    marginTop: '1rem',
  },
};

export default Section;

import style from './auroraBlob.module.css';

const AuroraBlob = () => {
  return (
    <>
      <div className={`${style.auroraBlob} ${style.blob1}`}></div>
      <div className={`${style.auroraBlob} ${style.blob2}`}></div>
      <div className={`${style.auroraBlob} ${style.blob3}`}></div>
    </>
  );
};

export default AuroraBlob;
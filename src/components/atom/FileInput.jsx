function FileInput({ onChange, refFile }) {
  return <input type="file" ref={refFile} onChange={onChange} />;
}

export default FileInput;

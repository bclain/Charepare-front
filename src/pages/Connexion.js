import React from 'react';

const Connexion = () => {
    return (
        <section>
            <div className="contentfront">
                <div className='connexion'>
                    <h1>Connexion</h1>
                    <div>
                        <form>
                            <form>
                                <div class="mb-3">
                                    <label for="exampleInputEmail1" class="form-label">Email address</label>
                                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                                </div>
                                <div class="mb-3">
                                    <label for="exampleInputPassword1" class="form-label">Password</label>
                                    <input type="password" class="form-control" id="exampleInputPassword1"/>
                                </div>
                                <button type="submit" class="btn-base btn-primary">Submit</button>
                            </form>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Connexion;
